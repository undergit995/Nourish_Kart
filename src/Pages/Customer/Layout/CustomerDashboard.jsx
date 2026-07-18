import React, { useEffect } from 'react'
import HomeNavbar from "../../../Themes/HomeNavbar"
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../../api/axiosConfig';
import { fetchCompanyInfo } from '../../../Redux/Slices/AdminSlice/CompanyInfoSlice';

function CustomerDashboard() {
  
  const company = useSelector((state) => state.companyInfo.info);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCompanyInfo());
  }, [dispatch]);

  return (
    <div>
      <HomeNavbar company={company} />
      <Outlet/>
    </div>
  )
}

export default CustomerDashboard