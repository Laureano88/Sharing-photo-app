"use client";
import React, { useState } from 'react';
import { FaUser, FaSearch, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const EmployeeListDemo = () => {
  const [selectedDesign, setSelectedDesign] = useState('card');
  const [searchTerm, setSearchTerm] = useState('');

  const mockEmployees = [
    { id: 1, name: 'Juan Pérez', position: 'Desarrollador', department: 'IT', status: 'present', avatar: null },
    { id: 2, name: 'María García', position: 'Diseñadora', department: 'Diseño', status: 'present', avatar: null },
    { id: 3, name: 'Carlos López', position: 'Gerente', department: 'Ventas', status: 'absent', avatar: null },
    { id: 4, name: 'Ana Martínez', position: 'Contador', department: 'Finanzas', status: 'present', avatar: null },
    { id: 5, name: 'Luis Rodríguez', position: 'Marketing', department: 'Marketing', status: 'absent', avatar: null },
  ];

  const filteredEmployees = mockEmployees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Diseño 1: Tarjetas con Avatar Grande
  const CardDesign = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-24 relative">
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                  <FaUser className="text-4xl text-gray-400" />
                </div>
              </div>
            </div>
            <div className="pt-16 pb-6 px-6 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-1">{employee.name}</h3>
              <p className="text-sm text-gray-500 mb-1">{employee.position}</p>
              <p className="text-xs text-gray-400 mb-4">{employee.department}</p>
              <div className="flex gap-2 justify-center">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                  Presente
                </button>
                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                  Ausente
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Diseño 2: Lista Compacta con Toggle
  const ListDesign = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Empleado
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Puesto
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Departamento
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Asistencia
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEmployees.map((employee, index) => (
              <tr
                key={employee.id}
                className={`hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUser className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">{employee.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {employee.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={employee.status === 'present'} />
                    <div className="relative w-14 h-7 bg-red-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex gap-2 justify-center">
                    <button className="text-blue-600 hover:text-blue-800 transition-colors">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-800 transition-colors">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Diseño 3: Tarjetas Horizontales con Estado
  const HorizontalCardDesign = () => (
    <div className="space-y-3">
      {filteredEmployees.map((employee) => (
        <div
          key={employee.id}
          className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4 ${
            employee.status === 'present' ? 'border-green-500' : 'border-red-500'
          }`}
        >
          <div className="flex items-center p-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              employee.status === 'present' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <FaUser className={`text-2xl ${
                employee.status === 'present' ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
            <div className="flex-1 ml-4">
              <h3 className="text-lg font-bold text-gray-800">{employee.name}</h3>
              <p className="text-sm text-gray-600">{employee.position}</p>
              <p className="text-xs text-gray-400">{employee.department}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-colors">
                <FaCheckCircle className="text-xl" />
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-colors">
                <FaTimesCircle className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Diseño 4: Grid Minimalista
  const MinimalGridDesign = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {filteredEmployees.map((employee) => (
        <div
          key={employee.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-200"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
              <FaUser className="text-3xl text-white" />
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-1">{employee.name}</h3>
            <p className="text-xs text-gray-500 mb-1">{employee.position}</p>
            <p className="text-xs text-gray-400 mb-4">{employee.department}</p>
            <div className="w-full grid grid-cols-2 gap-2">
              <button className="bg-green-50 hover:bg-green-100 text-green-600 py-2 rounded-lg text-xs font-semibold transition-colors border border-green-200">
                ✓
              </button>
              <button className="bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-xs font-semibold transition-colors border border-red-200">
                ✗
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Lista de Empleados
              </h1>
              <p className="text-gray-500">Gestiona la asistencia de tu equipo</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md">
              <FaPlus />
              <span>Nuevo Empleado</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o puesto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            />
          </div>

          {/* Design Selector */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDesign('card')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDesign === 'card'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tarjetas Grandes
            </button>
            <button
              onClick={() => setSelectedDesign('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDesign === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Lista Tabla
            </button>
            <button
              onClick={() => setSelectedDesign('horizontal')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDesign === 'horizontal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tarjetas Horizontales
            </button>
            <button
              onClick={() => setSelectedDesign('minimal')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDesign === 'minimal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Grid Minimalista
            </button>
          </div>
        </div>

        {/* Employee List */}
        <div className="mb-6">
          {selectedDesign === 'card' && <CardDesign />}
          {selectedDesign === 'list' && <ListDesign />}
          {selectedDesign === 'horizontal' && <HorizontalCardDesign />}
          {selectedDesign === 'minimal' && <MinimalGridDesign />}
        </div>

        {/* Stats Footer */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{mockEmployees.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Empleados</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {mockEmployees.filter(e => e.status === 'present').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Presentes</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">
                {mockEmployees.filter(e => e.status === 'absent').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Ausentes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeListDemo;
