import {Route, Routes} from "react-router-dom";
import Category from "../../Pages/Category";
import NormalLogin from "../../user/login/NormalLogin";
import Logout from "../../user/logout/Logout";
import Warehouse from "../../Pages/warehouse";
import Categories from "../../Pages/categories";
import {Order} from "../Order";
import ProductManage from "../../Pages/productManage";
import Signup from "../../user/signup/Signup";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Category/>}></Route>
            <Route path="/login" element={<NormalLogin/>}></Route>
            <Route path="/signup" element={<Signup/>}></Route>
            <Route path="/logout" element={<Logout/>}></Route>
            <Route path="/admin/categories" element={<Categories/>}></Route>
            <Route path="/seller/products" element={<ProductManage/>}></Route>
            <Route path="/admin/warehouse" element={<Warehouse/>}></Route>
            <Route path="/:categoryId" element={<Category/>}></Route>
            <Route path="/order" element={<Order/>}></Route>
        </Routes>
    );
}

export default AppRoutes;
