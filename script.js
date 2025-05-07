const API_URL = 'http://localhost:3000/api/employees';

// DOM Elements
const employeeForm = document.getElementById('employee-form');
const formTitle = document.getElementById('form-title');
const employeeIdInput = document.getElementById('employee-id');
const nameInput = document.getElementById('name');
const positionInput = document.getElementById('position');
const salaryInput = document.getElementById('salary');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const employeesList = document.getElementById('employees-list');
const loadingElement = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const noEmployees = document.getElementById('no-employees');
const employeesTable = document.getElementById('employees-table');
const searchInput = document.getElementById('search-input');
let allEmployees = []; // Store all employees for filtering

let isEditing = false;

document.addEventListener('DOMContentLoaded', () => {
    fetchEmployees();
    setupEventListeners();
});

function setupEventListeners() {
    employeeForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
    searchInput.addEventListener('input', handleSearch);
}

async function fetchEmployees() {
    try {
        showLoading(true);
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const employees = await response.json();
        allEmployees = employees; // Store all employees
        showLoading(false);
        displayEmployees(employees);
    } catch (error) {
        showLoading(false);
        showError(`Failed to fetch employees: ${error.message}`);
        console.error('Error fetching employees:', error);
    }
}

function displayEmployees(employees) {
    if (employees.length === 0) {
        employeesTable.classList.add('hidden');
        noEmployees.classList.remove('hidden');
        return;
    }
    
    employeesTable.classList.remove('hidden');
    noEmployees.classList.add('hidden');
    
    employeesList.innerHTML = employees.map(employee => `
        <tr>
            <td>${employee.Id}</td>
            <td>${escapeHtml(employee.Name)}</td>
            <td>${escapeHtml(employee.Position)}</td>
            <td>$${employee.Salary.toFixed(2)}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${employee.Id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${employee.Id}">Delete</button>
            </td>
        </tr>
    `).join('');
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editEmployee(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteEmployee(parseInt(btn.dataset.id)));
    });
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const employeeData = {
        Name: nameInput.value,
        Position: positionInput.value,
        Salary: parseFloat(salaryInput.value)
    };
    
    try {
        if (isEditing) {
            const employeeId = parseInt(employeeIdInput.value);
            await updateEmployee(employeeId, employeeData);
        } else {
            await addEmployee(employeeData);
        }
        
        resetForm();
        fetchEmployees();
    } catch (error) {
        showError(`Failed to ${isEditing ? 'update' : 'add'} employee: ${error.message}`);
        console.error(`Error ${isEditing ? 'updating' : 'adding'} employee:`, error);
    }
}

async function addEmployee(employeeData) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    
    return response.json();
}

async function updateEmployee(id, employeeData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    
    return response.json();
}

async function deleteEmployee(id) {
    if (!confirm('Are you sure you want to delete this employee?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }
        
        fetchEmployees();
    } catch (error) {
        showError(`Failed to delete employee: ${error.message}`);
        console.error('Error deleting employee:', error);
    }
}

async function editEmployee(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const employee = await response.json();
        
        employeeIdInput.value = employee.Id;
        nameInput.value = employee.Name;
        positionInput.value = employee.Position;
        salaryInput.value = employee.Salary;
        
        formTitle.textContent = 'Edit Employee';
        submitBtn.textContent = 'Update Employee';
        cancelBtn.classList.remove('hidden');
        isEditing = true;
        
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        showError(`Failed to load employee details: ${error.message}`);
        console.error('Error fetching employee details:', error);
    }
}

function resetForm() {
    employeeForm.reset();
    employeeIdInput.value = '';
    formTitle.textContent = 'Add New Employee';
    submitBtn.textContent = 'Add Employee';
    cancelBtn.classList.add('hidden');
    isEditing = false;
    errorMessage.classList.add('hidden');
}

function showLoading(isLoading) {
    if (isLoading) {
        loadingElement.classList.remove('hidden');
        employeesTable.classList.add('hidden');
        noEmployees.classList.add('hidden');
    } else {
        loadingElement.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    
    if (!searchTerm) {
        displayEmployees(allEmployees);
        return;
    }
    
    const filteredEmployees = allEmployees.filter(employee => 
        employee.Name.toLowerCase().includes(searchTerm) 
    );
    
    displayEmployees(filteredEmployees);
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}