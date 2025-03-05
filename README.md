# COMMUTING COST CALCULATION FOR EMPLOYEES

This API accesses data from external APIs: **CNPJA**, which provides information from the Federal Revenue, and **ViaCEP** (both from Brazil), which offers the employee's address details. It stores company and employee information in two separate JSON files.

## Installation

To get started using the application locally, follow these steps:

### Prerequisites

Make sure you have Node.js installed on your machine. You can download it [here](https://nodejs.org/).

### Cloning the repository

Clone this repository to your local machine using:

```bash
git clone https://github.com/rafael-calixto1/passage-pay
```

### Installation

Go to the application folder and install the dependencies using the command:

```bash
cd passage-pay/api
```

Install the dependencies:
```bash
npm install
```

### Running the application

To run the application, use the command:

```bash
npm start
```

The application will run on port 3000 by default. You can test it at http://localhost:3000.

## Endpoint Information

### Employees

#### `GET /api/employees`

- Description: Returns a list of all employees.
- Parameters: None.
- Request Body: None.

#### `POST /api/employees`

- Description: Creates a new employee.
- Request Body Example:
```json
{
   "name": "name",
   "lastName": "surname",
   "cpf": "cpf",
   "position": "position",
   "company": "company",
   "zipCode": 777777777,
   "idCompany": 7
}
```

#### `PUT /api/employees`

- Description: Updates an employee.
- Request Body Example:
```json
{
   "name" : "name",
   "lastName" : "surname",
   "cpf" : "cpf",
   "position" : "position",
   "company" : "company",
   "zipCode" : 777777777,
   "idCompany" : 7
}
```

#### `GET /api/employees/unemployed`

- Description: Returns a list of employees not linked to any company.
- Parameters: None.
- Request Body: None.

#### `GET /api/employees/:idemployee/address`

- Description: Returns the address information based on the employee's ID.
- Request: By parameters.

### Companies

#### `GET /api/companies`
- Description: Returns a list of companies.
- Parameters: None.
- Request Body: None.

#### `GET /api/companies/:idcompany`
- Description: Returns a specific company.
- Request: By parameters.

#### `GET /api/companies/:idcompany/employees`
- Description: Returns a list of employees from a specific company.
- Request: By parameters.

#### `GET /api/companies/:idcompany/information`
- Description: Retrieves company information from the CNPJA API.
- Request: By parameters.

#### `POST /api/companies`
- Description: Creates a new company.
- Request Body Example:
```json
 {
     "name" : "BRAZ CUBAS",
    "cnpj" : "52556412000106"
}
```

#### `POST /api/calculation`

- Description: Calculates the commuting cost based on the company's and employee's information.
- Request Body Example:
```json
{
    "idCompany" : 7,
    "idEmployee" : 1
}
```
