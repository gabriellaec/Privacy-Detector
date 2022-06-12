# Privacy-Detector

Extensão do Firefox que detecta possíveis ameaças à privacidade

## Para usar
1. No navegador no firefox, acessar **about:debugging#/runtime/this-firefox**
2. Clicar em __Load Temporary Add-on__ e selecionar o arquivo __manifest.json__ deste repositório

## Features implementadas
- Detecção e classificação de cookies 
- Detecção de local storage e session storage 
- Detecção de conexões externas 
- Cálculo de score baseado nas métricas de privacidade (aquelas que prejudicam mais a privacidade do usuário têm maior peso no cálculo)
- Identificação de Canvas Fingerprint
- Score do SSL labs
- Checagem da ativação do Content Security Policy (CSP)
