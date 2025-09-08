import React from 'react';
import { Bot, MessageSquare, Settings, Shield, Zap, BarChart3 } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">OpenAI Assistant</h1>
                <p className="text-sm text-gray-500">pour Home Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
                Installé
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">État de l'installation</h2>
              <p className="text-gray-600">L'intégration OpenAI Assistant a été téléchargée avec succès</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Setup Steps */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">1. Redémarrer Home Assistant</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Redémarrez Home Assistant pour charger la nouvelle intégration
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-xs font-medium">⚠️ Redémarrage obligatoire</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">2. Clé API OpenAI</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Obtenez votre clé API sur platform.openai.com
            </p>
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Obtenir la clé API →
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">3. Configuration</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Ajoutez l'intégration dans Configuration → Intégrations
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-xs font-medium">🔍 Recherchez "OpenAI Assistant"</p>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <BarChart3 className="w-6 h-6 text-indigo-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Fonctionnalités disponibles</h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Chat intégré</h4>
                <p className="text-sm text-gray-600">Interface conversationnelle directement dans Home Assistant</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                <BarChart3 className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Analyse automatique</h4>
                <p className="text-sm text-gray-600">ChatGPT analyse vos entités et automatisations</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                <Zap className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Suggestions intelligentes</h4>
                <p className="text-sm text-gray-600">Propositions d'optimisations avec validation</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                <Shield className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Actions sécurisées</h4>
                <p className="text-sm text-gray-600">Toutes les modifications nécessitent confirmation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Prochaines étapes</h3>
          <div className="space-y-2 text-blue-100">
            <p>• Redémarrez Home Assistant</p>
            <p>• Obtenez votre clé API OpenAI</p>
            <p>• Configurez l'intégration dans Configuration → Intégrations</p>
            <p>• Accédez au panel "OpenAI Assistant" dans la barre latérale</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
