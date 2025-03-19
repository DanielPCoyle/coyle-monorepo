import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import babel from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";


export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      outDir: "dist",
    }),
    babel({
      extensions: [".ts", ".tsx"],
      babelHelpers: "bundled",
      presets: ["@babel/preset-react"],
    }),
    postcss({
      extract: true, // Extracts the CSS into a separate file
      minimize: true, // Minify CSS
      modules: false, // Set to true if using CSS modules
    }),
  ],
  external: ["react", "react-dom"],
};
