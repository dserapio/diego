import React, { useEffect, useMemo } from 'react';
import { Route, matchPath, withRouter } from 'react-router-dom';

import Home from './pages/Home';
import Information from './pages/Info';
import Calculator from './pages/Calculator';
import FindRecycler from './pages/FindRecycler';
import Error from './pages/Error';

import { TransWrap } from './utils/Transitions';
import { siteName } from '../App';
import '../App.css';


const Pages = ({location}) => {
   const linkNames = useMemo(() => {
      const links = Object.keys(paths);
      return pathNames()
         .reduce((obj, name, i) => ({...obj, [links[i]]: name}), {});
   }, []);
   
   const urlPaths = urls();

   //find valid route before for name for title
   const valid = Object.keys(urlPaths).reduce((match, path) => (
      match || matchPath(location.pathname, {path, exact: true})
   ), false);

   const path = valid ? urlPaths[valid.path] : "/error";
   const matchComp = paths[path].Comp;

   useEffect(() => {
      document.title = `e-Stewards - ${linkNames[path]}`;
   }, [linkNames, path]);

   return <>
      {Object.entries(paths).map(( [path, {Comp, trans, rel}] ) => (
         <Route key={path} exact path={path}>
            {() => ( //will always render
               <TransWrap 
                  in={Comp===matchComp} classNames={trans} 
                  divClass={rel ? "rel" : ""}
               >
                  <Comp />
               </TransWrap>
            )}
         </Route>
      ))}
   </>;
};


const paths = {
   "/": {
      Comp: Home, trans: "zoom", rel: true },
   "/information": {
      Comp: Information, trans: "fade", rel: true },
   "/calculator": {
      Comp: Calculator, trans: "fade", rel: true },
   "/find-recycler": {
      Comp: FindRecycler, trans: "fade", rel: false },
   "/error": {
      Comp: Error, trans: "fade", rel: true }
};

export const urls = () => (
   Object.keys(paths)
      .map(path => [`${siteName}${path}`, path])
      .reduce((obj, [url, name]) => ({...obj, [url]: name}), {})
);

export const pathNames = () => (
   Object.keys(paths)
      .map(name => name.replace('/', ''))
      .map(name => name==="" ? "home" : name)
      .map(name => name.replace('-', ' '))
      .map(name => name.replace(/ ([a-z])/, r => r.toUpperCase()))
      .map(name => name.replace(/^./, f => f.toUpperCase()))
);

export default withRouter(Pages);
