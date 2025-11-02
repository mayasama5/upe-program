import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Upload, Image as ImageIcon, Save, Loader2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

export default function LogoSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({
    university_logo: null,
    faculty_logo: null,
    techhub_logo: null
  });
  const [previews, setPreviews] = useState({
    university_logo: null,
    faculty_logo: null,
    techhub_logo: null
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data.data);

      // Set current logos as previews
      if (response.data.data) {
        setPreviews({
          university_logo: response.data.data.university_logo
            ? `${BACKEND_URL}${response.data.data.university_logo}`
            : null,
          faculty_logo: response.data.data.faculty_logo
            ? `${BACKEND_URL}${response.data.data.faculty_logo}`
            : null,
          techhub_logo: response.data.data.techhub_logo
            ? `${BACKEND_URL}${response.data.data.techhub_logo}`
            : null
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (logoType, event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('El archivo debe ser menor a 2MB');
        return;
      }

      setSelectedFiles(prev => ({ ...prev, [logoType]: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [logoType]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();

      // Append only selected files
      if (selectedFiles.university_logo) {
        formData.append('university_logo', selectedFiles.university_logo);
      }
      if (selectedFiles.faculty_logo) {
        formData.append('faculty_logo', selectedFiles.faculty_logo);
      }
      if (selectedFiles.techhub_logo) {
        formData.append('techhub_logo', selectedFiles.techhub_logo);
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(`${BACKEND_URL}/api/admin/settings/logos`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert('Logos actualizados correctamente');
        setSettings(response.data.data);
        setSelectedFiles({
          university_logo: null,
          faculty_logo: null,
          techhub_logo: null
        });
        // Reload page to show new logos
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating logos:', error);
      alert('Error al actualizar los logos: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const LogoUploadField = ({ logoType, label, description }) => (
    <div className="space-y-3">
      <div>
        <Label className="text-white">{label}</Label>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      </div>

      {/* Preview */}
      <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center bg-slate-800/50">
        {previews[logoType] ? (
          <div className="space-y-2">
            <img
              src={previews[logoType]}
              alt={label}
              className="max-h-32 mx-auto object-contain"
            />
            <p className="text-xs text-gray-400">Vista previa</p>
          </div>
        ) : (
          <div className="py-8">
            <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Sin logo</p>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="relative">
        <input
          type="file"
          id={logoType}
          accept="image/*"
          onChange={(e) => handleFileChange(logoType, e)}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById(logoType).click()}
          className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
        >
          <Upload className="w-4 h-4 mr-2" />
          {selectedFiles[logoType] ? 'Cambiar imagen' : 'Seleccionar imagen'}
        </Button>
        {selectedFiles[logoType] && (
          <p className="text-xs text-cyan-400 mt-1">
            Archivo seleccionado: {selectedFiles[logoType].name}
          </p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Logos del Sistema</CardTitle>
        <CardDescription className="text-gray-400">
          Administra los logos que aparecen en el encabezado de la plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <LogoUploadField
              logoType="university_logo"
              label="Logo Universidad"
              description="Logo de la universidad (lado izquierdo)"
            />

            <LogoUploadField
              logoType="techhub_logo"
              label="Logo TechHub UPE"
              description="Logo principal de TechHub (centro)"
            />

            <LogoUploadField
              logoType="faculty_logo"
              label="Logo Facultad"
              description="Logo de la facultad (lado derecho)"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-700">
            <Button
              type="submit"
              disabled={saving || (!selectedFiles.university_logo && !selectedFiles.faculty_logo && !selectedFiles.techhub_logo)}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Tamaño máximo: 2MB por imagen</p>
            <p>• Formatos aceptados: PNG, JPG, JPEG, GIF</p>
            <p>• Recomendado: Imágenes con fondo transparente (PNG)</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
