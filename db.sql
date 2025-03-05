CREATE DATABASE passagepay;

USE company_employee_db;

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lastName VARCHAR(255),
    cpf VARCHAR(20) NOT NULL,
    position VARCHAR(255) DEFAULT 'unemployed',
    company VARCHAR(255),
    zipCode VARCHAR(10),
    idCompany INT DEFAULT 0
);

CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) NOT NULL
);


INSERT INTO companies (id, name, cnpj) VALUES
('BRAZ CUBAS', '52556412000106'),
('SUZANO PAPEL', '16404287000155'),
('SANOFI, Suzano', '10588595001092'),
('BAUMINAS QUIMICA', '23647365000108'),
('DENVER INDUSTRIA E COMERCIO DE PRODUTOS QUIMICOS', '53137527000129'),
('CONEXAO WEB TELECOM', '17225163000175'),
('AUTOMOB SA', '43513237000189'),
('VISIVEL - LIMPEZA AMBIENTAL LTDA', '65898322000145'),
('VISIVEL - LIMPEZA AMBIENTAL LTDA', '69047157000179'),
('TALARES EMPREENDIMENTOS, PARTICIPACOES E SERVICOS LTD', '03102723000190'),
('EDMA - EMPRESA DE DESENVOLVIMENTO E MECANIZACAO AGROPECUARIA', '03927262000194'),
('MAHLE BEHR GERENCIAMENTO TERMICO BRASIL LTDA', '56167091000109');

INSERT INTO employees (id, name, lastName, cpf, position, company, zipCode, idCompany) VALUES
('nome', 'Dofuncionario', '123123312', 'tarara', 'UBC', '08696040', 1),
('nome2', 'Dofuncionario', '123123312', 'tarara', 'UBC', '08840000', 1),
('Rennam', 'Santos', '1dd56789', 'mecanico', 'Techdasdsa Inc', '08773380', 1),
('Alan', 'Santos', '1dd56789', 'desempregado', '', '08773380', 0),
('Alan', 'Santos', '1dd56789', 'desempregado', '', '07404020', 0),
('Alan', 'Santos', '1dd56789', 'desempregado', '', '07428280', 0),
('Alan', 'Santos', '1dd56789', 'desempregado', '', '08561310', 0),
('Daniel', 'Alves', '1dd56789', 'desempregado', '', '08675000', 0);
