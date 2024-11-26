import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CustomerList from "./components/customer/CustomerList";
import CustomerProvider from "./contexts/CustomerContext";
import Menu from "./Menu";
import LineList from "./components/line/LineList";
import Line from "./components/line/Line";
import SalesItemList from "./components/salesItem/SalesItemList";
import SalesItem from "./components/salesItem/SalesItem";
import LineProvider from "./contexts/LineContext";
import ServiceTypeProvider from "./contexts/TypeServiceContext";
import ServiceType from "./components/serviceType/ServiceType";
import ServiceTypeList from "./components/serviceType/ServiceTypeList";
import SalesItemProvider from "./contexts/SalesItemContext";
import ServiceProvider from "./contexts/ServiceContext";
import ServiceList from "./components/service/ServiceList";
import Service from "./components/service/Service";
import Customer from "./components/customer/Customer";

function App() {
  return (
    <div className="conteiner">
      <BrowserRouter>
        <Menu />
        <Routes>
          <Route
            exact
            path="/customer-list"
            element={
              <CustomerProvider>
                <CustomerList />
              </CustomerProvider>
            }
          />

          <Route
            exact
            path="/customer"
            element={
              <CustomerProvider>
                <Customer title="Nuevo" />
              </CustomerProvider>
            }
          />
          <Route
            exact
            path="/customer/:id"
            element={
              <CustomerProvider>
                <Customer title="Editar" />
              </CustomerProvider>
            }
          />

          <Route
            exact
            path="/line-list"
            element={
              <LineProvider>
                <LineList />
              </LineProvider>
            }
          />
          <Route
            exact
            path="/line"
            element={
              <LineProvider>
                <Line title="Nuevo" />
              </LineProvider>
            }
          />
          <Route
            exact
            path="/line/:id"
            element={
              <LineProvider>
                <Line title="Editar" />
              </LineProvider>
            }
          />

          <Route
            exact
            path="/item-list"
            element={
              <SalesItemProvider>
                <SalesItemList />
              </SalesItemProvider>
            }
          />

          <Route
            exact
            path="/item"
            element={
              <SalesItemProvider>
                <SalesItem title="Nuevo" />
              </SalesItemProvider>
            }
          />
          <Route
            exact
            path="/item/:id"
            element={
              <SalesItemProvider>
                <SalesItem title="Editar" />
              </SalesItemProvider>
            }
          />

          <Route
            exact
            path="/service-type-list"
            element={
              <ServiceTypeProvider>
                <ServiceTypeList />
              </ServiceTypeProvider>
            }
          />
          <Route
            exact
            path="/service-type"
            element={
              <ServiceTypeProvider>
                <ServiceType title="Nuevo" />
              </ServiceTypeProvider>
            }
          />
          <Route
            exact
            path="/service-type/:id"
            element={
              <ServiceTypeProvider>
                <ServiceType title="Editar" />
              </ServiceTypeProvider>
            }
          />

          <Route
            exact
            path="/service-list"
            element={
              <ServiceProvider>
                <ServiceList />
              </ServiceProvider>
            }
          />
          <Route
            exact
            path="/service"
            element={
              <ServiceProvider>
                <Service title="Nuevo" />
              </ServiceProvider>
            }
          />
          <Route
            exact
            path="/service/:id"
            element={
              <ServiceProvider>
                <Service title="Editar" />
              </ServiceProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
