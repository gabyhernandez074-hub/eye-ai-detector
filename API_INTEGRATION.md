# API Integration Documentation

## Overview

This application integrates with the Retinal Detachment Detection API to provide AI-powered analysis of fundus images.

## API Endpoint

**Production API URL:** `https://eyes.hellsoft.tech/api/v1`

This URL is configured as the default in the `.env` file and should **NOT** be changed unless you have a different API deployment.

## Environment Configuration

The API endpoint is configured via environment variables:

```bash
VITE_API_URL=https://eyes.hellsoft.tech/api/v1
```

### Setup Instructions

1. The `.env` file is already created with the correct production URL
2. For local development, you can create a `.env.local` file to override (optional)
3. Never commit `.env` files to version control (already in `.gitignore`)

## API Service

The API integration is handled by `/src/services/apiService.ts`, which provides:

### Functions

#### `predictRetinalDetachment(imageFile: File, includeVisualization: boolean)`

Main function to analyze retinal images.

**Parameters:**
- `imageFile`: The image file to analyze (JPG, PNG, or WebP)
- `includeVisualization`: Whether to include Grad-CAM visualization (default: `true`)

**Returns:**
```typescript
{
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
      original_image: string;  // base64 encoded PNG
      heatmap: string;         // base64 encoded PNG
      overlay: string;         // base64 encoded PNG
    };
  };
}
```

#### `checkHealth()`

Check API health status.

#### `getModelInfo()`

Get information about the AI model.

## Image Requirements

- **Supported formats:** JPG, JPEG, PNG, WebP
- **Maximum file size:** 10 MB
- **Recommended size:** 224x224 pixels (images will be resized automatically)

## Features

### 1. Image Upload
- Drag-and-drop support
- File validation (type and size)
- Preview before analysis

### 2. AI Analysis
- Real-time API integration
- Progress indicators
- Error handling

### 3. Results Visualization
- Original image display
- Grad-CAM heatmap
- Overlay visualization
- Confidence scores
- Prediction probabilities
- Clinical recommendations

### 4. Report Generation
- PDF export with all results
- Patient information
- Analysis metadata
- Visualization images

## Error Handling

The application handles various error scenarios:

| Error | Cause | User Message |
|-------|-------|--------------|
| Invalid file type | Non-image file uploaded | "Por favor cargue un archivo de imagen válido (JPEG/PNG/WebP)" |
| File too large | File > 10MB | "El tamaño máximo de archivo es 10MB" |
| API error | Network or server issues | Custom error message from API |
| No image selected | Analysis without image | "No se ha seleccionado ninguna imagen" |

## Testing the Integration

### Manual Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Upload a fundus image
3. Click "Ejecutar Análisis de IA"
4. Verify:
   - Loading state appears
   - Results are displayed correctly
   - Visualizations load (3 images: original, heatmap, overlay)
   - PDF report includes all information

### API Health Check

You can verify API connectivity by calling:
```javascript
import { checkHealth } from '@/services/apiService';

const health = await checkHealth();
console.log(health);
```

Expected response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cpu",
  "version": "1.0.0"
}
```

## Troubleshooting

### Issue: API not responding

**Solution:**
1. Check your internet connection
2. Verify the API URL in `.env` is correct: `https://eyes.hellsoft.tech/api/v1`
3. Check browser console for CORS errors
4. Try the health check endpoint: `https://eyes.hellsoft.tech/api/v1/health`

### Issue: CORS errors

**Solution:**
The API should already be configured to accept requests from your domain. If you see CORS errors, contact the API administrator.

### Issue: Visualizations not displaying

**Solution:**
1. Ensure `includeVisualization` is set to `true` in the API call
2. Check browser console for image loading errors
3. Verify the API response contains the `visualization` object

### Issue: File upload fails

**Solution:**
1. Check file size (must be < 10MB)
2. Verify file format (JPG, PNG, or WebP only)
3. Try a different image file

## Production Deployment

### Environment Variables

For production deployment, ensure:

1. `.env` file contains the production API URL
2. Environment variables are properly loaded by Vite
3. Build process includes environment configuration:

```bash
npm run build
```

### CORS Configuration

The production API is configured to accept requests from:
- `http://localhost:3000` (development)
- `http://localhost:5173` (Vite default)
- Your production domain

If deploying to a new domain, request CORS configuration update from the API administrator.

## API Response Examples

### Successful Detection

```json
{
  "success": true,
  "data": {
    "diagnosis": "Retinal detachment",
    "confidence": 99.96,
    "class_index": 1,
    "prediction_probabilities": {
      "Healthy": 0.04,
      "Retinal detachment": 99.96
    },
    "recommendation": {
      "severity": "high",
      "urgency": "immediate",
      "action": "Seek emergency ophthalmologic care"
    },
    "metadata": {
      "processing_time_ms": 583.15,
      "device": "cpu",
      "timestamp": "2025-11-18T15:37:32.287152+00:00"
    },
    "visualization": {
      "original_image": "data:image/png;base64,...",
      "heatmap": "data:image/png;base64,...",
      "overlay": "data:image/png;base64,..."
    }
  }
}
```

### Healthy Result

```json
{
  "success": true,
  "data": {
    "diagnosis": "Healthy",
    "confidence": 98.75,
    "class_index": 0,
    "prediction_probabilities": {
      "Healthy": 98.75,
      "Retinal detachment": 1.25
    },
    "recommendation": {
      "severity": "low",
      "urgency": "routine",
      "action": "Continue regular monitoring"
    },
    ...
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds maximum allowed size",
    "details": "Maximum file size is 10MB",
    "timestamp": "2025-11-18T15:37:32.287152+00:00"
  }
}
```

## Code Examples

### Basic Usage

```typescript
import { predictRetinalDetachment } from '@/services/apiService';

const handleImageAnalysis = async (file: File) => {
  try {
    const result = await predictRetinalDetachment(file, true);
    console.log('Diagnosis:', result.data.diagnosis);
    console.log('Confidence:', result.data.confidence);
  } catch (error) {
    console.error('Analysis failed:', error);
  }
};
```

### With Full Error Handling

```typescript
import { predictRetinalDetachment } from '@/services/apiService';
import { toast } from '@/hooks/use-toast';

const handleImageAnalysis = async (file: File) => {
  try {
    const result = await predictRetinalDetachment(file, true);
    
    // Process successful result
    setAnalysisResult(result.data);
    
    toast({
      title: "Análisis Completo",
      description: `Diagnóstico: ${result.data.diagnosis}`,
    });
  } catch (error) {
    toast({
      title: "Error en el Análisis",
      description: error instanceof Error ? error.message : "Error desconocido",
      variant: "destructive",
    });
  }
};
```

## Support

For API-related issues or questions:
- API Documentation: See integration guide in project
- Technical Support: Contact API administrator
- Frontend Issues: Check browser console for errors

## Version History

- **v1.0.0** (2025-11-19): Initial integration with production API
  - Added environment configuration
  - Implemented API service layer
  - Updated UI components for visualization
  - Added comprehensive error handling
