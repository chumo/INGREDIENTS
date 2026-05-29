# LABEL REGULATORY

A modern, browser-based web application designed to validate ingredient lists against a template and extract allergen concentrations from documents using AI.

Deployed at: https://chumo.github.io/INGREDIENTS/index.html

## Features

### Ingredients Validator
- **AI-Powered Validation**: Validates the list of ingredients from a product label against a PDF template.
- **Visual Mapping UI**: Features a detailed side-by-side mapping visualization to instantly spot missing, unnecessary, or incorrectly ordered ingredients.
- **Concentration Rules**: Automatically flags ingredients that violate decreasing concentration (weight/percentage) rules, with a visual separator indicating elements under 1% concentration.
- **ROI Selection**: Draw a bounding box on the product label to focus the AI's extraction on specific areas for better accuracy.

### Allergen Extractor
- **Allergen Extraction**: Upload a document to extract concentration percentages for known allergens (using INCI names).
- **Extra INCI Detection**: Automatically identifies and displays additional INCI ingredients found in the document that aren't on the standard allergen list.
- **Metadata Parsing**: Extracts key document metadata, such as the Product Code and Printing Date.
- **Data Export**: Quickly copy all extracted allergen concentration data to the clipboard.

### General
- **Extensive AI Model Support**: Integrates with OpenRouter, OpenAI, Gemini, Anthropic, and Mistral.
- **Client-Side Privacy**: Documents are rendered locally using PDF.js without server-side processing, preserving user privacy.
- **Multi-Language Support**: The interface is fully translated into English and Spanish.

## Setup
Simply open `index.html` in any modern browser to use the application. No complex server environments are required.

## Technologies Used
- HTML5 / CSS3 / Vanilla JavaScript
- PDF.js (Client-side rendering)
- SVGs for mapping lines
- OpenRouter / OpenAI / Gemini / Anthropic / Mistral integrations
