import { useState } from 'react';
import styles from './XMLFormatterPage.module.css';

// Simple XML pretty print helper function
const prettyPrintXml = (xml: string): string => {
  const PADDING = '  '; // two spaces
  const reg = /(>)(<)(\/*)/g;
  let formatted = '';
  let pad = 0;
  xml = xml.replace(reg, '$1\n$2$3');
  xml.split('\n').forEach((line) => {
    if (line.match(/^<\/\w/)) pad -= 1;
    formatted += PADDING.repeat(pad) + line + '\n';
    if (line.match(/^<\w[^>]*[^\/]>.*$/)) pad += 1;
  });
  return formatted.trim();
};

const XMLFormatterPage = () => {
  const [rawXml, setRawXml] = useState('');
  const [formattedXml, setFormattedXml] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePrettify = () => {
    try {
      // Parsing using DOMParser to validate XML
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawXml, 'application/xml');
      const parsererror = doc.getElementsByTagName('parsererror');

      if (parsererror.length > 0) {
        throw new Error('Invalid XML');
      }

      const serializer = new XMLSerializer();
      const serializedXml = serializer.serializeToString(doc);
      const pretty = prettyPrintXml(serializedXml);

      setFormattedXml(pretty);
      setError(null);
    } catch (e) {
      setError('Invalid XML. Please ensure your input is well-formed.');
      setFormattedXml('');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>XML Formatter</h2>

      <textarea
        className={styles.textarea}
        placeholder="Paste your XML here..."
        rows={15}
        value={rawXml}
        onChange={(e) => setRawXml(e.target.value)}
      />

      <button className={styles.button} onClick={handlePrettify}>
        Prettify XML
      </button>

      {error && <p className={styles.error}>{error}</p>}

      {formattedXml && (
        <pre className={styles.output}>
          {formattedXml}
        </pre>
      )}
    </div>
  );
};

export default XMLFormatterPage;
