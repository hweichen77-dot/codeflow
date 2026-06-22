// AP Computer Science A — module aggregator (Java).
// Each module exports default { project, lessons } with project.track === 'apcsa'
// and lessons set language 'java' (solutions declare `public class Main`).
import csa_01 from './module-csa-01.js'
import csa_02 from './module-csa-02.js'
import csa_03 from './module-csa-03.js'
import csa_04 from './module-csa-04.js'
import csa_05 from './module-csa-05.js'
import csa_06 from './module-csa-06.js'
import csa_07 from './module-csa-07.js'
import csa_08 from './module-csa-08.js'
import csa_09 from './module-csa-09.js'
import csa_10 from './module-csa-10.js'

export const MODULES = [csa_01, csa_02, csa_03, csa_04, csa_05, csa_06, csa_07, csa_08, csa_09, csa_10]

export { default as BRIEFS } from './briefs.js'
