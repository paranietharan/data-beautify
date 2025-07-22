import { useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';

import styles from './JsonFormatterPage.module.css';

const JsonFormatterPage = () => {
  const [rawJson, setRawJson] = useState<string>('');
  const [findText, setFindText] = useState<string>('');
  const [replaceText, setReplaceText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const beautifyJson = () => {
    try {
      const parsed = JSON.parse(rawJson);
      const pretty = JSON.stringify(parsed, null, 2);
      setRawJson(pretty);
      setError(null);
    } catch (err) {
      setError('Invalid JSON');
    }
  };

  const handleFindReplace = () => {
    try {
      const parsed = JSON.parse(rawJson);
      const stringified = JSON.stringify(parsed);
      const replaced = stringified.replaceAll(findText, replaceText);
      const reparsed = JSON.parse(replaced);
      setRawJson(JSON.stringify(reparsed, null, 2));
      setError(null);
    } catch (err) {
      setError('Find/Replace failed. Ensure valid JSON and replace values.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>JSON Beautifier</h2>

      <section className={styles.controls}>
        <button onClick={beautifyJson} className={styles.button}>Prettify</button>

        <div className={styles.findReplace}>
          <input
            type="text"
            placeholder="Find"
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Replace"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleFindReplace} className={styles.button}>Replace</button>
        </div>
      </section>

      {error && <p className={styles.error}>{error}</p>}

      <AceEditor
        mode="json"
        theme="github"
        fontSize={14}
        showPrintMargin={false}
        value={rawJson}
        onChange={(value) => setRawJson(value)}
        name="json-editor"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height="500px"
        className={styles.editor}
      />
    </div>
  );
};

export default JsonFormatterPage;
