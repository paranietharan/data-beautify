import { useState } from 'react';
import styles from './XMLFormatterPage.module.css';

// Enhanced XML pretty print helper function
const prettyPrintXml = (xml: string): string => {
  const PADDING = '  '; // two spaces
  const reg = /(>)(<)(\/*)/g;
  let formatted = '';
  let pad = 0;
  
  // Clean up the XML first
  xml = xml.trim();
  
  // Add line breaks between tags
  xml = xml.replace(reg, '$1\n$2$3');
  
  xml.split('\n').forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return; // Skip empty lines
    
    // Decrease padding for closing tags
    if (trimmedLine.match(/^<\/\w/)) pad -= 1;
    
    // Add the line with proper indentation
    formatted += PADDING.repeat(Math.max(0, pad)) + trimmedLine + '\n';
    
    // Increase padding for opening tags (but not self-closing tags)
    if (trimmedLine.match(/^<\w[^>]*[^\/]>.*$/) && !trimmedLine.match(/^<\w[^>]*\/>$/)) {
      pad += 1;
    }
  });
  
  return formatted.trim();
};

const XMLFormatterPage = () => {
  const [rawXml, setRawXml] = useState('');
  const [formattedXml, setFormattedXml] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isWarning, setIsWarning] = useState(false);

  const handleClear = () => {
    setRawXml('');
    setFormattedXml('');
    setError(null);
    setIsWarning(false);
  };

  const handlePrettify = () => {
    try {
      if (!rawXml.trim()) {
        setError('Please enter some XML content to format.');
        setFormattedXml('');
        return;
      }

      // Basic XML validation - check for common issues
      const xmlContent = rawXml.trim();
      
      // Clear any previous errors and warnings
      setError(null);
      setIsWarning(false);
      
      // Check for XML declaration (just a warning, not an error)
      let warningMessage = '';
      if (!xmlContent.startsWith('<?xml')) {
        warningMessage = 'Note: XML should ideally start with <?xml declaration, but proceeding anyway...';
      }

      // Check for balanced tags
      const openTags = xmlContent.match(/<[^\/!?][^>]*>/g) || [];
      const closeTags = xmlContent.match(/<\/[^>]+>/g) || [];
      
      // Count actual opening tags (excluding self-closing)
      const actualOpenTags = openTags.filter(tag => !tag.endsWith('/>'));
      
      if (actualOpenTags.length !== closeTags.length) {
        setError(`XML structure issue: Found ${actualOpenTags.length} opening tags but ${closeTags.length} closing tags. Please check for unclosed tags.`);
        setIsWarning(false);
        setFormattedXml('');
        return;
      }

      // Try parsing with DOMParser
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlContent, 'application/xml');
      const parsererror = doc.getElementsByTagName('parsererror');

      if (parsererror.length > 0) {
        const errorText = parsererror[0].textContent || 'Unknown parsing error';
        setError(`XML parsing error: ${errorText}`);
        setIsWarning(false);
        setFormattedXml('');
        return;
      }

      // If parsing succeeds, format the XML
      const pretty = prettyPrintXml(xmlContent);
      setFormattedXml(pretty);
      
      // Show warning if there was one, but don't treat it as an error
      if (warningMessage) {
        setError(warningMessage);
        setIsWarning(true);
      } else {
        setError(null);
        setIsWarning(false);
      }
    } catch (e) {
      setError(`Error processing XML: ${e instanceof Error ? e.message : 'Unknown error'}`);
      setIsWarning(false);
      setFormattedXml('');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>XML Formatter & Validator</h2>
      <p style={{ color: '#6b7280', fontSize: '1.1rem', textAlign: 'center', maxWidth: '800px' }}>
        Paste your XML content below to format and validate it. The tool will help identify any structural issues.
      </p>

      <div style={{ width: '100%', maxWidth: 'calc(100vw - 4rem)', boxSizing: 'border-box' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
          XML Input:
        </label>
        <textarea
          className={styles.textarea}
          placeholder="Paste your XML here...&#10;&#10;Example:&#10;&lt;?xml version=&quot;1.0&quot;?&gt;&#10;&lt;root&gt;&#10;  &lt;item&gt;Content&lt;/item&gt;&#10;&lt;/root&gt;"
          value={rawXml}
          onChange={(e) => setRawXml(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className={styles.button} onClick={handlePrettify}>
          Format & Validate XML
        </button>
        <button 
          className={styles.button} 
          onClick={handleClear}
          style={{ backgroundColor: '#6b7280' }}
        >
          Clear All
        </button>
      </div>

      {error && (
        <div className={isWarning ? styles.warning : styles.error}>
          {error}
        </div>
      )}

      {formattedXml && (
        <div style={{ width: '100%', maxWidth: 'calc(100vw - 4rem)', boxSizing: 'border-box' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
            Formatted Output:
          </label>
          <pre className={styles.output}>
            {formattedXml}
          </pre>
        </div>
      )}
    </div>
  );
};

export default XMLFormatterPage;
