import {Switch, Route} from 'react-router-dom'

import Login from './components/Login'

import Home from './components/Home'

import ProtectedRoute from './components/ProtectedRoute'

import DetailedProductInfo from './components/DetailedProductInfo'

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute
      exact
      path="/products/:id"
      component={DetailedProductInfo}
    />
  </Switch>
)

export default App
