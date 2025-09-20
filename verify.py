from playwright.sync_api import sync_playwright, Page, expect

def verify_pdf_editor(page: Page):
    """
    This script verifies that the new PDF Editor is accessible from the
    homepage and that the editor page itself loads correctly.
    """
    # 1. Navigate to the homepage.
    page.goto("http://localhost:3000")

    # 2. Verify the PDF Editor card is on the homepage and take a screenshot.
    pdf_editor_card = page.get_by_role("link", name="PDF Editor")
    expect(pdf_editor_card).to_be_visible()
    page.screenshot(path="homepage.png")

    # 3. Click the card to navigate to the editor.
    pdf_editor_card.click()

    # 4. Verify the editor page has loaded.
    expect(page).to_have_url("http://localhost:3000/pdf-editor")

    # Check for the main title on the editor page.
    title = page.get_by_role("heading", name="PDF Editor")
    expect(title).to_be_visible()

    # Check for the file input area.
    file_input_area = page.get_by_text("Drag and drop a PDF file here, or click to select a file.")
    expect(file_input_area).to_be_visible()

    # 5. Take a screenshot of the initial editor page.
    page.screenshot(path="editor.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_pdf_editor(page)
        browser.close()

if __name__ == "__main__":
    main()
