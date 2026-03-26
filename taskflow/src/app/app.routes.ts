import { Routes } from "@angular/router";
import { LoginComponent } from "./main-panel/pages/login/login.component";
import { DashboardComponent } from "./main-panel/pages/dashboard/dashboard.component";
import { TransfersComponent } from "./main-panel/pages/transfers/transfers.component";
import { LoansComponent } from "./main-panel/pages/loans/loans.component";
import { TransactionsComponent } from "./main-panel/pages/transactions/transactions.component";
import { CreateTransactionComponent } from "./main-panel/pages/transactions/components/create-transaction/create-transaction.component";
import { ProfileComponent } from "./main-panel/pages/profile/profile.component";
import { PersonalDataComponent } from "./main-panel/pages/profile/components/personal-data/personal-data.component";
import { SecurityDataComponent } from "./main-panel/pages/profile/components/security-data/security-data.component";
import { NotFoundComponent } from "./main-panel/pages/not-found/not-found.component";
import { ResultLoanComponent } from "./main-panel/pages/loans/component/result-loan/result-loan.component";
import { CreateTransferComponent } from "./main-panel/pages/transfers/components/create-transfer/create-transfer.component";
import { authGuard } from "./core/guards/auth.guard";
import { MainPanelComponent } from "./main-panel/main-panel.component";

export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" }, 
    { path: "login", component: LoginComponent },
    {
        path: '',
        component: MainPanelComponent,
        canActivate: [authGuard],
        children: [
            { path: "dashboard", component: DashboardComponent },
            { path: "transferencia", component: TransfersComponent },
            { path: "transferencia/criar", component: CreateTransferComponent },
            { path: "emprestimo", component: LoansComponent },
            { path: "emprestimo/simulacao", component: ResultLoanComponent },
            { path: "transacoes", component: TransactionsComponent },
            { path: "transacoes/criar", component: CreateTransactionComponent },
            { path: "transacoes/editar/:id", component: CreateTransactionComponent },
            { 
                path: "perfil", 
                component: ProfileComponent,
                children:[
                    { path: "dados", component: PersonalDataComponent},
                    { path: "seguranca", component: SecurityDataComponent},
                    { path: "", redirectTo: "dados", pathMatch: "full" },
                ]
            },
        ],
    },    
    { path: "**", component: NotFoundComponent },
]