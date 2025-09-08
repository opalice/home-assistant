# OpenAI Assistant pour Home Assistant

Une intégration Home Assistant qui permet d'utiliser OpenAI ChatGPT pour analyser, optimiser et gérer votre installation Home Assistant de manière intelligente.

## 🌟 Fonctionnalités

- **Chat intégré** : Interface conversationnelle directement dans Home Assistant
- **Analyse automatique** : ChatGPT analyse vos entités, automatisations et configuration
- **Suggestions intelligentes** : Propositions d'optimisations avec validation obligatoire
- **Actions sécurisées** : Toutes les modifications nécessitent une confirmation
- **Interface moderne** : Design adaptatif avec thème sombre/clair
- **Historique complet** : Suivi des conversations et actions effectuées

## 📋 Prérequis

- Home Assistant Core 2023.1 ou plus récent
- Une clé API OpenAI (disponible sur [platform.openai.com](https://platform.openai.com/api-keys))
- Accès à l'internet pour communiquer avec l'API OpenAI

## 🚀 Installation

### Méthode HACS (Recommandée)

1. Ouvrez HACS dans Home Assistant
2. Allez dans "Integrations"
3. Cliquez sur les trois points en haut à droite
4. Sélectionnez "Custom repositories"
5. Ajoutez l'URL de ce repository
6. Sélectionnez "Integration" comme catégorie
7. Cliquez sur "Add"
8. Recherchez "OpenAI Assistant" et installez-le
9. HACS copie automatiquement le fichier du panneau dans `www/community/openai-assistant/`
10. Ajoutez le panneau suivant à votre `configuration.yaml` :

    ```yaml
    panel_custom:
      - name: openai-assistant
        sidebar_title: OpenAI Assistant
        sidebar_icon: mdi:robot
        module_url: /hacsfiles/openai-assistant/openai-assistant-panel.js
        url_path: openai-assistant
        embed_iframe: false
        require_admin: false
    ```
11. Redémarrez Home Assistant
12. Ouvrez le panneau via la barre latérale ou `http://<ip>:8123/openai-assistant`

### Installation manuelle (depuis GitHub)

1. Téléchargez l'archive de ce repository ou clonez-le
2. Copiez le dossier `custom_components/openai_assistant` vers votre dossier `<config>/custom_components/`
3. Copiez le dossier `www/openai-assistant` vers votre dossier `<config>/www/openai-assistant/`
4. Ajoutez le panneau suivant à votre `configuration.yaml` :

    ```yaml
    panel_custom:
      - name: openai-assistant
        sidebar_title: OpenAI Assistant
        sidebar_icon: mdi:robot
        module_url: /local/openai-assistant/openai-assistant-panel.js
        url_path: openai-assistant
        embed_iframe: false
        require_admin: false
    ```
5. Redémarrez Home Assistant

## ⚙️ Configuration

1. Allez dans **Configuration** → **Intégrations**
2. Cliquez sur **"Ajouter une intégration"**
3. Recherchez **"OpenAI Assistant"**
4. Entrez votre clé API OpenAI et configurez les paramètres :
   - **Nom** : Nom personnalisé pour l'intégration
   - **Clé API** : Votre clé API OpenAI
   - **Modèle** : Choisissez entre GPT-4, GPT-3.5-turbo, etc.
   - **Tokens maximum** : Limite de tokens par réponse (100-4000)
   - **Température** : Niveau de créativité (0.0-2.0)

## 🎯 Utilisation

### Interface Web

1. Accédez au panneau "OpenAI Assistant" dans la barre latérale
2. Utilisez le chat pour poser des questions à ChatGPT
3. Cliquez sur les actions rapides pour des analyses prédéfinies
4. Consultez les statistiques d'utilisation

### Services disponibles

#### `openai_assistant.ask_chatgpt`
Pose une question à ChatGPT avec contexte Home Assistant
```yaml
service: openai_assistant.ask_chatgpt
data:
  message: "Comment optimiser mes automatisations d'éclairage ?"
  include_context: true
```

#### `openai_assistant.analyze_system`
Lance une analyse complète du système
```yaml
service: openai_assistant.analyze_system
data:
  focus_area: "automatisations"
```

#### `openai_assistant.execute_suggestion`
Exécute une suggestion approuvée
```yaml
service: openai_assistant.execute_suggestion
data:
  suggestion_id: "suggestion_123"
  confirmed: true
```

### Exemples de questions

- "Analyse mes automatisations et propose des optimisations"
- "Comment améliorer la sécurité de mon installation ?"
- "Quelles entités ne sont pas utilisées dans mes automatisations ?"
- "Propose des automatisations pour économiser l'énergie"
- "Vérifie ma configuration et détecte les problèmes"

## 🔒 Sécurité

- **Validation obligatoire** : Toutes les actions proposées nécessitent une confirmation explicite
- **Clé API chiffrée** : La clé API est stockée de manière sécurisée
- **Analyse seulement** : Par défaut, ChatGPT ne fait qu'analyser sans modifier
- **Permissions granulaires** : Contrôle précis des actions autorisées

## 📊 Capteurs créés

L'intégration crée automatiquement ces capteurs :

- **sensor.openai_assistant_status** : Statut de l'intégration
- **sensor.openai_conversations** : Nombre de conversations
- **sensor.openai_suggestions** : Nombre de suggestions générées

## 🛠️ Dépannage

### Erreurs communes

**"Invalid API Key"**
- Vérifiez que votre clé API OpenAI est correcte
- Assurez-vous d'avoir des crédits sur votre compte OpenAI

**"Rate limit exceeded"**
- Vous avez atteint la limite de taux OpenAI
- Attendez quelques minutes ou mettez à niveau votre plan OpenAI

**"Cannot connect"**
- Vérifiez votre connexion internet
- Assurez-vous que Home Assistant peut accéder à api.openai.com

### Logs de débogage

Ajoutez à votre `configuration.yaml` :
```yaml
logger:
  logs:
    custom_components.openai_assistant: debug
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Forker le projet
2. Créer une branche pour votre fonctionnalité
3. Committer vos changements
4. Pousser vers la branche
5. Créer une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- L'équipe Home Assistant pour l'excellente plateforme
- OpenAI pour l'API ChatGPT
- La communauté Home Assistant pour les retours et suggestions

## 📞 Support

- [Issues GitHub](https://github.com/custom-components/openai-assistant/issues)
- [Forum Home Assistant](https://community.home-assistant.io/)
- [Discord Home Assistant](https://discord.gg/c5DvZ4e)

---

**⚠️ Avertissement** : Cette intégration utilise l'API OpenAI qui est un service payant. Consultez les tarifs OpenAI avant utilisation intensive.