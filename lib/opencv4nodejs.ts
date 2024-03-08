import { type OpenCVBuildEnvParams } from '@edumolki/opencv-build';
import promisify from './promisify.js';
import extendWithJsSources from './src';
import { getOpenCV } from './cvloader.js';
import type * as openCV from '..';
declare type OpenCVType = typeof openCV;

function loadOpenCV(opt?: OpenCVBuildEnvParams): OpenCVType {
  const cvBase = getOpenCV(opt);
  if (!cvBase.accumulate) {
    throw Error('failed to load opencv basic accumulate not found.')
  }
  if (!cvBase.blur) {
    throw Error('failed to load opencv basic blur not found.')
  }
  
  // promisify async methods
  let cvObj = promisify<OpenCVType>(cvBase);
  cvObj = extendWithJsSources(cvObj);
  // add xmodules alias if not present (moved to C++ part)
  // if (!cvObj.xmodules && cvObj.modules)
  //  cvObj.xmodules = cvObj.modules
  return cvObj;
}

const cv = loadOpenCV({ prebuild: 'latestBuild' });
const defExport = { cv };
// duplicate all export for retro-compatibility
for (const key in cv) {
  defExport[key] = cv[key];
}
defExport['cv'] = cv;

export = defExport;
