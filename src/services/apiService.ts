// API Service for Retinal Detachment Detection
const API_URL = import.meta.env.VITE_API_URL || 'https://eyes.hellsoft.tech/api/v1';

export interface PredictionResponse {
  success: boolean;
  data: {
    diagnosis: string;
    confidence: number;
    class_index: number;
    prediction_probabilities: {
      Healthy: number;
      "Retinal detachment": number;
    };
    recommendation: {
      severity: string;
      urgency: string;
      action: string;
    };
    metadata: {
      processing_time_ms: number;
      device: string;
      timestamp: string;
    };
    visualization?: {
      original_image: string;
      heatmap: string;
      overlay: string;
    };
  };
  error?: {
    code: string;
    message: string;
    details: string;
    timestamp: string;
  };
}

export interface HealthCheckResponse {
  status: string;
  model_loaded: boolean;
  device: string;
  version: string;
}

export interface ModelInfoResponse {
  model_name: string;
  version: string;
  classes: string[];
  input_size: number[];
  supported_formats: string[];
  max_file_size_mb: number;
}

/**
 * Check API health status
 */
export async function checkHealth(): Promise<HealthCheckResponse> {
  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) {
    throw new Error('API health check failed');
  }
  return response.json();
}

/**
 * Get model information
 */
export async function getModelInfo(): Promise<ModelInfoResponse> {
  const response = await fetch(`${API_URL}/model/info`);
  if (!response.ok) {
    throw new Error('Failed to fetch model information');
  }
  return response.json();
}

/**
 * Submit image for retinal detachment prediction
 * @param imageFile - The image file to analyze
 * @param includeVisualization - Whether to include Grad-CAM visualization (default: true)
 */
export async function predictRetinalDetachment(
  imageFile: File,
  includeVisualization: boolean = true
): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('include_visualization', includeVisualization.toString());

  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  const result: PredictionResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error?.message || 'Failed to process image for prediction'
    );
  }

  return result;
}

/**
 * Convert base64 image to blob URL for display
 */
export function base64ToUrl(base64String: string): string {
  return base64String;
}

export default {
  checkHealth,
  getModelInfo,
  predictRetinalDetachment,
  base64ToUrl,
};
