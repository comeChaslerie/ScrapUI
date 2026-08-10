'use strict';

// Schematic ng-add minimal, écrit en JS pur pour éviter une étape de build.
// Ajoute l'import du thème dans styles.scss du projet par défaut.
function ngAdd() {
  return (tree, context) => {
    const candidates = ['src/styles.scss', 'src/styles.css'];
    const stylesPath = candidates.find((p) => tree.exists(p));
    const importLine = "@use 'scrap-ui/styles/index';\n";

    if (!stylesPath) {
      context.logger.warn(
        `Aucun ${candidates.join(' ou ')} trouvé — ajoute manuellement : ${importLine.trim()}`,
      );
      return tree;
    }
    if (stylesPath.endsWith('.css')) {
      context.logger.warn(
        `Le projet utilise du CSS pur (${stylesPath}). Passe-le en SCSS puis ajoute : ${importLine.trim()}`,
      );
      return tree;
    }

    const content = tree.read(stylesPath).toString('utf-8');
    if (!content.includes("scrap-ui/styles")) {
      tree.overwrite(stylesPath, importLine + content);
      context.logger.info(`✔ Thème Scrap UI importé dans ${stylesPath}`);
    }
    context.logger.info(
      '→ Favicon et manifest de la charte : node_modules/scrap-ui/assets/ (favicon.svg, manifest.webmanifest)',
    );
    return tree;
  };
}

exports.ngAdd = ngAdd;
