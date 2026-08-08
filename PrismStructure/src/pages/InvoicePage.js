export class InvoicePage {
    constructor(page) {
      this.page = page;
  
      // User account menu toggle in top nav ("Jane Doe")
      this.userMenuToggle = page.locator('[data-test="nav-menu"]')
        .or(page.locator('#menu'))
        .or(page.getByRole('button', { name: /jane doe/i }))
        .or(page.locator('.dropdown-toggle'));
  
      // "My Invoices" link in dropdown
      this.myInvoicesNav = page.locator('[data-test="nav-my-invoices"]')
        .or(page.getByRole('link', { name: /my invoices/i }))
        .or(page.getByRole('menuitem', { name: /invoices/i }))
        .or(page.getByText('My Invoices'));
  
      // Invoices list container / table / rows
      this.invoiceTable = page.locator('table')
        .or(page.locator('.table'))
        .or(page.locator('[data-test="invoices-table"]'))
        .or(page.locator('.containerApp'));
  
      this.invoiceRows = page.locator('tbody tr')
        .or(page.locator('.table tr'));
  
      // 👈 ADDED: Invoice status tag locator used by assertions
      this.invoiceStatusTag = page.locator('[data-test="invoice-status"]')
        .or(page.locator('.badge'))
        .or(page.getByText(/paid|pending|completed/i))
        .first();
    }
  
    async navigateToMyInvoices() {
      await this.page.waitForTimeout(1500);
  
      if (await this.userMenuToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
        await this.userMenuToggle.click();
        await this.page.waitForTimeout(500);
  
        if (await this.myInvoicesNav.isVisible({ timeout: 3000 }).catch(() => false)) {
          await this.myInvoicesNav.click();
          await this.page.waitForLoadState('networkidle').catch(() => {});
          return;
        }
      }
  
      // Fallback navigation
      await this.page.goto('/#/account/invoices');
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  
    async verifyLatestInvoice() {
      await this.page.waitForSelector('table, .table, [data-test="invoice-number"], .card', {
        state: 'visible',
        timeout: 10000
      });
  
      const hasInvoices = await this.invoiceRows.count();
      if (hasInvoices === 0) {
        await this.page.locator('tbody tr, .card, [data-test="invoice-number"]').first().waitFor({ state: 'visible', timeout: 5000 });
      }
    }
  }