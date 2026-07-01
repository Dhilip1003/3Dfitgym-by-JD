import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface User {
  id: string;
  username: string;
  email: string;
  fitnessGoals?: string[];
  bodyModel?: BodyModel;
}

interface BodyModel {
  modelUrl?: string;
  reconstructionStatus?: string;
  reconstructionProvider?: string;
  lastUpdated?: string;
  metrics?: BodyMetrics;
}

interface BodyMetrics {
  chest?: number | null;
  waist?: number | null;
  hips?: number | null;
  arms?: number | null;
  thighs?: number | null;
  shoulders?: number | null;
}

interface Exercise {
  id: string;
  name: string;
  description?: string;
  targetBodyPart: string;
  difficulty?: string;
  videoUrl?: string;
  articleUrl?: string;
}

interface FoodSuggestion {
  id: string;
  mealType?: string;
  name: string;
  description?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  stock?: number;
}

type View = 'dashboard' | 'body-model' | 'exercises' | 'food' | 'products';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private readonly apiUrl = 'http://localhost:8080/api';

  activeView: View = 'dashboard';
  statusMessage = '';
  errorMessage = '';
  loadingProducts = false;
  loadingExercises = false;
  selectedFiles: File[] = [];

  user: User | null = null;
  userId = '';
  exerciseUserId = '';
  foodUserId = '';

  metrics: Record<keyof BodyMetrics, string> = {
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: '',
    shoulders: ''
  };

  exercises: Exercise[] = [];
  suggestedExercises: Exercise[] = [];
  foodSuggestions: FoodSuggestion[] = [];
  products: Product[] = [];

  navItems: Array<{ id: View; label: string }> = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'body-model', label: '3D Model' },
    { id: 'exercises', label: 'Exercises' },
    { id: 'food', label: 'Food' },
    { id: 'products', label: 'Products' }
  ];

  metricKeys = Object.keys(this.metrics) as Array<keyof BodyMetrics>;

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadExercises();
    this.loadProducts();
  }

  setView(view: View): void {
    this.activeView = view;
    this.clearMessages();
  }

  createUser(): void {
    const newUser = {
      username: 'user1',
      email: `user-${Date.now()}@example.com`,
      password: `Demo-${crypto.randomUUID()}!`,
      fitnessGoals: ['weight-loss', 'muscle-gain']
    };

    this.http.post<User>(`${this.apiUrl}/users`, newUser).subscribe({
      next: (user) => {
        this.user = user;
        this.userId = user.id;
        this.exerciseUserId = user.id;
        this.foodUserId = user.id;
        this.statusMessage = 'Test user created and selected for recommendations.';
        this.errorMessage = '';
      },
      error: () => this.showError('Could not create user. Check that the backend and MongoDB are running.')
    });
  }

  updateBodyModel(): void {
    if (!this.userId.trim()) {
      this.showError('Enter a user ID before updating measurements.');
      return;
    }

    const bodyModel: BodyModel = {
      modelUrl: `https://example.com/3d-model/${this.userId}`,
      reconstructionStatus: 'manual',
      metrics: this.toMetricPayload()
    };

    this.http.put<User>(`${this.apiUrl}/users/${this.userId}/body-model`, bodyModel).subscribe({
      next: (user) => {
        this.user = user;
        this.statusMessage = 'Body measurements were saved.';
        this.errorMessage = '';
      },
      error: () => this.showError('Could not update the body model for that user ID.')
    });
  }

  uploadForReconstruction(): void {
    if (!this.userId.trim()) {
      this.showError('Enter a user ID before uploading captures.');
      return;
    }

    if (!this.selectedFiles.length) {
      this.showError('Choose at least one front, side, back, or video capture.');
      return;
    }

    const formData = new FormData();
    this.selectedFiles.forEach((file) => formData.append('captures', file));
    this.metricKeys.forEach((key) => {
      if (this.metrics[key]) formData.append(key, this.metrics[key]);
    });

    this.http.post<User>(`${this.apiUrl}/users/${this.userId}/body-model/reconstruct`, formData).subscribe({
      next: (user) => {
        this.user = user;
        this.statusMessage = user.bodyModel?.reconstructionStatus === 'pending'
          ? 'Captures uploaded. Configure RECONSTRUCTION_API_URL to complete third-party 3D reconstruction.'
          : '3D reconstruction completed and saved.';
        this.errorMessage = '';
      },
      error: () => this.showError('Upload failed. Use image or video files under the configured size limit.')
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFiles = Array.from(input.files ?? []);
  }

  loadExercises(): void {
    this.loadingExercises = true;
    this.http.get<Exercise[]>(`${this.apiUrl}/exercises`).subscribe({
      next: (exercises) => {
        this.exercises = exercises;
        this.loadingExercises = false;
      },
      error: () => {
        this.loadingExercises = false;
        this.showError('Could not load exercises.');
      }
    });
  }

  getSuggestedExercises(): void {
    if (!this.exerciseUserId.trim()) {
      this.showError('Enter a user ID to get exercise suggestions.');
      return;
    }

    this.http.get<Exercise[]>(`${this.apiUrl}/exercises/suggest/${this.exerciseUserId}`).subscribe({
      next: (exercises) => {
        this.suggestedExercises = exercises;
        this.statusMessage = `${exercises.length} exercise suggestion(s) loaded.`;
        this.errorMessage = '';
      },
      error: () => this.showError('Could not get suggestions for that user ID.')
    });
  }

  getFoodSuggestions(): void {
    if (!this.foodUserId.trim()) {
      this.showError('Enter a user ID to get food suggestions.');
      return;
    }

    this.http.get<FoodSuggestion[]>(`${this.apiUrl}/food-suggestions/user/${this.foodUserId}`).subscribe({
      next: (food) => {
        this.foodSuggestions = food;
        this.statusMessage = `${food.length} food suggestion(s) loaded.`;
        this.errorMessage = '';
      },
      error: () => this.showError('Could not get food suggestions for that user ID.')
    });
  }

  loadProducts(): void {
    this.loadingProducts = true;
    this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe({
      next: (products) => {
        this.products = products;
        this.loadingProducts = false;
      },
      error: () => {
        this.products = [];
        this.loadingProducts = false;
      }
    });
  }

  labelForMetric(key: string): string {
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  private toMetricPayload(): BodyMetrics {
    return this.metricKeys.reduce((payload, key) => {
      payload[key] = this.metrics[key] ? Number(this.metrics[key]) : null;
      return payload;
    }, {} as BodyMetrics);
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.statusMessage = '';
  }

  private clearMessages(): void {
    this.statusMessage = '';
    this.errorMessage = '';
  }
}
