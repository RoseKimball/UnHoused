import React, { useEffect, lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { LoadingOutlined } from '@ant-design/icons';
import 'react-toastify/dist/ReactToastify.css';

import { auth } from './firebase';
import { useDispatch } from 'react-redux';
import { currentUser } from './functions/auth';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Header = lazy(() => import('./components/nav/Header'));
const RegisterComplete = lazy(() => import('./pages/auth/RegisterComplete'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const UserRoute = lazy(() => import('./routes/UserRoute'));
const AdminRoute = lazy(() => import('./routes/AdminRoute'));
const Password = lazy(() => import('./pages/user/Password'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const CategoryCreate = lazy(() => import('./pages/admin/category/CategoryCreate'));
const CategoryUpdate = lazy(() => import('./pages/admin/category/CategoryUpdate'));
const ProductCreate = lazy(() => import('./pages/product/ProductCreate'));
const ProductUpdate = lazy(() => import('./pages/product/ProductUpdate'));
const Product = lazy(() => import('./pages/Product'));
const CategoryHome = lazy(() => import('./pages/category/CategoryHome'));
const Shop = lazy(() => import('./pages/Shop'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Payment = lazy(() => import('./pages/Payment'));

const App = () => {
  const dispatch = useDispatch();

  // to check firebase auth state
  useEffect(() => {
    const loggedIn = auth.onAuthStateChanged(async (user) => {
      if(user) {
        const idTokenResult = await user.getIdTokenResult();
        // console.log('user', user)
        currentUser(idTokenResult.token).then((res) => {
          dispatch({
              type: 'LOGGED_IN_USER',
              payload: {
                  name: res.data.name,
                  email: res.data.email,
                  token: idTokenResult.token,
                  role: res.data.role,
                  _id: res.data._id
              }
          })
          }).catch((err) => console.log(err))
      }
    })
    //cleanup
    return () => loggedIn();
  })

  return (
    <Suspense fallback={
      <div className='col text-center p-5'>
       UnHoused --- <LoadingOutlined />
      </div>
    }>
      <Header />
      <ToastContainer />
      <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/register' component={Register}/>
          <Route exact path='/registercomplete' component={RegisterComplete}/>
          <Route exact path='/forgot/password' component={ForgotPassword}/>
          <UserRoute exact path='/user/password' component={Password}/>
          <AdminRoute exact path='/admin/dashboard' component={AdminDashboard}/>
          <AdminRoute exact path='/admin/category' component={CategoryCreate}/>
          <AdminRoute exact path='/admin/category/:slug' component={CategoryUpdate}/>
          <AdminRoute exact path='/admin/product' component={ProductCreate}/>
          <AdminRoute exact path='/admin/product/:slug' component={ProductUpdate}/>
          <Route exact path='/product/:slug' component={Product}/>
          <Route exact path='/category/:slug' component={CategoryHome}/>
          <Route exact path='/shop' component={Shop}/>
          <Route exact path='/cart' component={Cart}/>
          <UserRoute exact path='/checkout' component={Checkout}/>
          <UserRoute exact path='/payment' component={Payment}/>
      </Switch>
    </Suspense>
  )
}


export default App;
