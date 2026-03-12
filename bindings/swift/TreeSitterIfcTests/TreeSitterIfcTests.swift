import XCTest
import SwiftTreeSitter
import TreeSitterIfc

final class TreeSitterIfcTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_ifc())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Ifc grammar")
    }
}
