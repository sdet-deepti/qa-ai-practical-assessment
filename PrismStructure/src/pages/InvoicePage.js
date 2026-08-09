export class InvoicePage {
    constructor(page) {
      this.page = page;
  
      // User account menu toggle in top nav ("Jane Doe")
      this.userMenuToggle = page.locator('[data-test="nav-menu"]');
  
      // "My Invoices" link in dropdown
      this.myInvoicesNav = page.getByRole('link', { name: 'My invoices' });
  
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

      this.invoiceNumberCell = page
        .locator('[data-test="invoice-number"]')
        .or(page.locator('tbody tr td').first())
        .first();
    }
  
    async navigateToMyInvoices() {
      await this.userMenuToggle.waitFor({ state: 'visible', timeout: 15000 });
      await this.userMenuToggle.click();
      await this.myInvoicesNav.waitFor({ state: 'visible', timeout: 10000 });
      await this.myInvoicesNav.click();
      await this.page.waitForURL(/account\/invoices/, { timeout: 20000 });
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

    async getLatestInvoiceNumberText() {
      await this.verifyLatestInvoice();
      const pageText = await this.page.locator('main, .containerApp, .container, body').first().innerText();
      const match = pageText.match(/INV-\d+/i);
      if (!match) {
        throw new Error('Invoice number pattern INV-* not found on My Invoices page');
      }
      return match[0];
    }
  }