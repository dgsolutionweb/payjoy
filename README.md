# Sistema de Controle de Vendas e Pagamentos

Sistema para gerenciamento de vendas de aparelhos celulares, com controle de pagamentos e lembretes automáticos.

## Funcionalidades

- Cadastro de vendas com informações detalhadas
- Dashboard com resumo de vendas e pagamentos
- Lembretes automáticos de pagamentos pendentes
- Histórico completo de vendas
- Controle de status de pagamentos
- Interface moderna e responsiva

## Configuração do Projeto

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o Supabase:
   - Crie uma conta no [Supabase](https://supabase.com)
   - Crie um novo projeto
   - Copie as credenciais (URL e Anon Key)
   - Crie um arquivo `.env` na raiz do projeto com as credenciais:
   ```
   VITE_SUPABASE_URL=sua-url-do-projeto
   VITE_SUPABASE_ANON_KEY=sua-chave-anon
   ```

4. Configure o banco de dados no Supabase:
   - Crie uma tabela `sales` com os seguintes campos:
     - id (int8, primary key)
     - seller_name (text)
     - customer_name (text)
     - device_name (text)
     - imei (text)
     - sale_date (date)
     - down_payment (numeric)
     - total_amount (numeric)
     - remaining_amount (numeric)
     - payment_due_date (timestamp)
     - status (text, default: 'pending')
     - created_at (timestamp with time zone, default: now())

5. Execute o projeto:
```bash
npm run dev
```

## Tecnologias Utilizadas

- React + Vite
- TypeScript
- Material-UI
- Supabase
- date-fns

## Estrutura do Projeto

- `/src/components`: Componentes React
- `/src/lib`: Configurações e utilitários
- `/src/types`: Tipos TypeScript
- `/src/assets`: Recursos estáticos

## Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
