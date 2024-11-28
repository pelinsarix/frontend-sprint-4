import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { buildWorkerDefinition } from 'vite-plugin-monaco-editor/worker';

// Register custom workers
self.MonacoEnvironment = {
  // eslint-disable-next-line no-unused-vars
  getWorker(_workerId, _label) {
    return new editorWorker();
  }
};

// Build workers
buildWorkerDefinition('monaco-editor/esm/vs/editor/editor.worker', {
  format: 'iife', // Use IIFE format for better compatibility
  sourcemap: true,
});

// Create diagnostics provider
monaco.languages.registerDiagnosticsProvider('lucaoshow', {
  provideDiagnostics: (model) => {
    const diagnostics = [];
    const text = model.getValue();
    
    // Exemplo básico de validação
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      // Verifica se há ponto e vírgula (que não é usado em lucaoshow)
      if (line.includes(';')) {
        diagnostics.push({
          severity: monaco.MarkerSeverity.Error,
          message: 'A linguagem lucaoshow não utiliza ponto e vírgula',
          startLineNumber: i + 1,
          startColumn: line.indexOf(';') + 1,
          endLineNumber: i + 1,
          endColumn: line.indexOf(';') + 2
        });
      }
      
      // Verifica abertura de bloco sem fechamento
      if (line.includes('{')) {
        let hasClosing = false;
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].includes('}')) {
            hasClosing = true;
            break;
          }
        }
        if (!hasClosing) {
          diagnostics.push({
            severity: monaco.MarkerSeverity.Error,
            message: 'Bloco aberto mas não fechado',
            startLineNumber: i + 1,
            startColumn: line.indexOf('{') + 1,
            endLineNumber: i + 1,
            endColumn: line.indexOf('{') + 2
          });
        }
      }
    });

    return {
      diagnostics
    };
  }
});

export default monaco;