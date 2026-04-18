# INGREDIENTS

A modern, browser-based web application designed to validate and compare ingredient lists between a template document and a product label using AI extraction.

Deployed at: https://chumo.github.io/INGREDIENTS/index.html

## Features
- **AI-Powered Extraction**: Uses advanced AI models (via OpenRouter, OpenAI, or Gemini) to intelligently parse text from PDFs and images.
- **Visual Mapping UI**: Features a detailed side-by-side mapping visualization allowing users to instantly spot missing, unnecessary, or incorrectly ordered ingredients.
- **Concentration Rules**: Automatically flags ingredients that violate decreasing concentration (weight/percentage) rules, with a visual separator indicating elements under 1% concentration.
- **Client-Side Workflow**: Documents are rendered to images locally using PDF.js without server-side processing, preserving privacy and security.

## Setup
Simply open `index.html` in any modern browser to use the application. No complex server environments are required.

## Technologies Used
- HTML5 / CSS3 / Vanilla JavaScript
- PDF.js (Client-side rendering)
- SVGs for mapping lines
- OpenRouter/OpenAI/Gemini integrations
