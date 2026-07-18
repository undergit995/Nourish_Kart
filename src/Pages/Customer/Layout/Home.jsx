import React, { useEffect } from 'react'
import Banner from "../../../Themes/Banner";
import Footer from "../../../Themes/Footer";
import ProductsHome from "../Products/ProductsHome";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCompanyInfo } from '../../../Redux/Slices/AdminSlice/CompanyInfoSlice';

function Home() {
  
    const company = useSelector((state) => state.companyInfo.info);
    const dispatch = useDispatch();
  
    useEffect(() => {
      dispatch(fetchCompanyInfo());
    }, [dispatch]);
  
  return (
    <div>
       <Banner company={company}/>
      <ProductsHome company={company}/>
      <Footer company={company}/>
    </div>
  )
}

export default Home