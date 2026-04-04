# 📊 Mini Banco Digital – Dashboard Financeiro  

Este projeto foi desenvolvido como parte do curso **Dev Front-end - III da Ada Tech**, módulos **Angular I e II**.  
Consiste em uma aplicação web **SPA (Single Page Application)** construída com **Angular**, simulando um dashboard de banco digital.  

No **Módulo I**, a aplicação foi criada com foco em **componentização, consumo de API e gerenciamento de estado**.  
No **Módulo II**, o sistema foi **refatorado e otimizado** para atingir nível empresarial, tornando-se **seguro, internacionalizado, reativo e com performance extrema**.  

O sistema permite ao usuário visualizar informações financeiras, realizar operações e interagir com dados consumidos de uma API.  

---

## 🚀 Funcionalidades e Conceitos Aplicados  

- Componentização  
- Injeção de dependências e interceptadores  
- Comunicação entre componentes  
- Data binding  
- Consumo de API com **HttpClient**  
- Estado compartilhado  
- Formulários reativos  
- Responsividade  
- Rotas avançadas  
- Reatividade moderna com **Signals** e **Control Flow**  
- Integração REST (CRUD completo)  
- Autenticação com **JWT** e rotas protegidas (Módulo II)  
- Internacionalização com **ngx-translate**  
- **Performance Absoluta**: Lazy Loading, Preloading e OnPush  

---

## ⚡ Recursos de Performance (Módulo II)  

Para garantir que a aplicação seja rápida, escalável e preparada para uso em larga escala, foram aplicadas técnicas de performance:  

- **Lazy Loading com Componentes Standalone**  
  Foi utilizado para reduzir o tempo de carregamento inicial. Assim, apenas o código necessário é baixado no primeiro acesso, evitando que o usuário espere por funcionalidades que ainda não serão usadas.  

- **Pré-carregamento de Módulos (Preloading)**  
  Resolve o problema de travamentos em conexões lentas. Enquanto o usuário interage com a tela inicial, os demais módulos são carregados em segundo plano, garantindo fluidez na navegação.  

- **ChangeDetectionStrategy.OnPush**  
  Foi aplicado para otimizar o uso da CPU, evitando verificações desnecessárias em componentes visuais que não mudam constantemente. Isso melhora a eficiência e a responsividade da aplicação.  

Esses recursos foram escolhidos para oferecer uma experiência mais rápida, fluida e eficiente ao usuário.  

---

## 🖥️ Tecnologias Utilizadas
- **Frontend:** Angular 19  
- **Backend:** db.json (utilizando JSON Server)  

---

## 📂 Repositório
[GitHub – VanessaMRocha](https://github.com/VanessaMRocha/dashboard-ada-angular1.git)

---

## ⚙️ Como rodar o projeto

### 1. Clonar o repositório
git clone https://github.com/VanessaMRocha/dashboard-ada-angular1.git

### 2. Acessar a pasta do projeto
cd dashboard-ada-angular1

### 3. Instalar dependências
npm install

### 4. Rodar o servidor mock (JSON Server)
json-server --watch api/db.json --port 3000

### 5. Rodar a aplicação Angular
ng serve

### 6. Acessar no navegador
Abra http://localhost:4200 (localhost in Bing) para visualizar a aplicação.
