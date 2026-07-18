import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchCompanyInfo } from '../../Redux/Slices/AdminSlice/CompanyInfoSlice'
import api from '../../api/axiosConfig'
import Navbar from '../../Themes/Navbar'
import { Outlet } from 'react-router-dom'
import ResponsiveAppBar from '../../Themes/Navbar'
import { fetchBanners } from '../../Redux/Slices/BannerSlice'

export default function LandingPageLayout() {
  const company = useSelector((state) => state.companyInfo.info);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCompanyInfo());
    dispatch(fetchBanners());
  }, [dispatch]);


  return (
    <div>
      <Navbar company={company}/>
        <Outlet/>
    </div>
  )
}
