import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import 'jest-enzyme'

import './failWhenConsoleMessage'

import './mockUseEffectForShallow'

configure({ adapter: new Adapter() })
