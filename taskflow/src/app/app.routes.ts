import { Routes } from "@angular/router";
import { LoginComponent } from "./main-panel/pages/login/login.component";
import { authGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" }, 
    { path: "login", component: LoginComponent },
    {
        path: '',
        loadComponent: () => import('./main-panel/main-panel.component').then(c => c.MainPanelComponent),
        canActivate: [authGuard],
        children: [
            { path: "dashboard", 
                loadComponent: () => import ('./main-panel/pages/dashboard/dashboard.component').then(c => c.DashboardComponent)  },
            { path: "transferencia", 
                loadComponent: () => import ('./main-panel/pages/transfers/transfers.component').then(c => c.TransfersComponent) },
            { path: "transferencia/criar", 
                loadComponent: () => import ('./main-panel/pages/transactions/components/create-transaction/create-transaction.component').then(c => c.CreateTransactionComponent) },
            { path: "emprestimo", 
                loadComponent: () => import ('./main-panel/pages/loans/loans.component').then(c => c.LoansComponent)
             },
            { path: "emprestimo/simulacao", 
                loadComponent: () => import ('./main-panel/pages/loans/component/result-loan/result-loan.component').then(c => c.ResultLoanComponent)
            },
            { path: "transacoes", 
                loadComponent: () => import ('./main-panel/pages/transactions/transactions.component').then(c => c.TransactionsComponent)
            },
            { path: "transacoes/criar", 
                loadComponent: () => import ('./main-panel/pages/transactions/components/create-transaction/create-transaction.component').then(c => c.CreateTransactionComponent)
            },
            { path: "transacoes/editar/:id", 
                loadComponent: () => import ('./main-panel/pages/transactions/components/create-transaction/create-transaction.component').then(c => c.CreateTransactionComponent)
             },
            { 
                path: "perfil", 
                loadComponent: () => import ('./main-panel/pages/profile/profile.component').then(c => c.ProfileComponent),
                children:[
                    { path: "dados", 
                        loadComponent: () => import ('./main-panel/pages/profile/components/personal-data/personal-data.component').then(c => c.PersonalDataComponent)
                    },
                    { path: "seguranca", 
                        loadComponent: () => import ('./main-panel/pages/profile/components/security-data/security-data.component').then(c => c.SecurityDataComponent)
                    },
                    { path: "", redirectTo: "dados", pathMatch: "full" },
                ]
            },
        ],
    },    
    { path: "**", 
        loadComponent: () => import ('./main-panel/pages/not-found/not-found.component').then(c => c.NotFoundComponent)
    },
]