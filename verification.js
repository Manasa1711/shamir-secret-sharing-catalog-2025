/**
 * VERIFICATION AND TESTING MODULE
 * File: verification.js
 * Purpose: Additional verification methods and manual calculations
 */

const { convertFromBase, lagrangeInterpolation } = require('./solution');

/**
 * Manual calculation for Test Case 1 verification
 * This provides step-by-step manual verification of our algorithm
 */
function manualTestCase1Verification() {
    console.log('🔍 MANUAL VERIFICATION - TEST CASE 1');
    console.log('='.repeat(50));
    
    console.log('\n📊 Step 1: Decode all points manually');
    const decodedPoints = [
        { x: 1, encoded: "4", base: 10, decoded: 4 },
        { x: 2, encoded: "111", base: 2, decoded: parseInt("111", 2) },
        { x: 3, encoded: "12", base: 10, decoded: 12 },
        { x: 6, encoded: "213", base: 4, decoded: parseInt("213", 4) }
    ];
    
    decodedPoints.forEach(point => {
        console.log(`  (${point.x}, ${point.decoded}): "${point.encoded}" in base ${point.base} = ${point.decoded}`);
    });
    
    console.log('\n📊 Step 2: Use first k=3 points for polynomial');
    const selectedPoints = [[1, 4], [2, 7], [3, 12]];
    console.log('  Selected points:', selectedPoints);
    
    console.log('\n📊 Step 3: Manual Lagrange calculation at x=0');
    
    // L1(0) = (0-2)(0-3) / (1-2)(1-3) = 6/2 = 3
    const L1_0 = ((0-2) * (0-3)) / ((1-2) * (1-3));
    console.log(`  L₁(0) = (0-2)(0-3)/((1-2)(1-3)) = ${(0-2)*(0-3)}/${(1-2)*(1-3)} = ${L1_0}`);
    
    // L2(0) = (0-1)(0-3) / (2-1)(2-3) = 3/(-1) = -3
    const L2_0 = ((0-1) * (0-3)) / ((2-1) * (2-3));
    console.log(`  L₂(0) = (0-1)(0-3)/((2-1)(2-3)) = ${(0-1)*(0-3)}/${(2-1)*(2-3)} = ${L2_0}`);
    
    // L3(0) = (0-1)(0-2) / (3-1)(3-2) = 2/2 = 1
    const L3_0 = ((0-1) * (0-2)) / ((3-1) * (3-2));
    console.log(`  L₃(0) = (0-1)(0-2)/((3-1)(3-2)) = ${(0-1)*(0-2)}/${(3-1)*(3-2)} = ${L3_0}`);
    
    const manualSecret = 4 * L1_0 + 7 * L2_0 + 12 * L3_0;
    console.log(`\n  f(0) = 4×${L1_0} + 7×${L2_0} + 12×${L3_0}`);
    console.log(`  f(0) = ${4*L1_0} + ${7*L2_0} + ${12*L3_0} = ${manualSecret}`);
    
    console.log(`\n✅ MANUAL CALCULATION RESULT: ${manualSecret}`);
    
    return manualSecret;
}

/**
 * Base conversion verification
 * Tests our base conversion function with known values
 */
function testBaseConversion() {
    console.log('\n🔍 BASE CONVERSION VERIFICATION');
    console.log('='.repeat(50));
    
    const testCases = [
        { value: "111", base: 2, expected: 7, description: "Binary to decimal" },
        { value: "213", base: 4, expected: 39, description: "Base 4 to decimal" },
        { value: "ff", base: 16, expected: 255, description: "Hex to decimal" },
        { value: "123", base: 8, expected: 83, description: "Octal to decimal" }
    ];
    
    let allPassed = true;
    testCases.forEach((test, index) => {
        const result = convertFromBase(test.value, test.base);
        const passed = result === test.expected;
        console.log(`  Test ${index + 1}: ${test.description}`);
        console.log(`    "${test.value}" (base ${test.base}) → ${result} ${passed ? '✅' : '❌'}`);
        console.log(`    Expected: ${test.expected}`);
        
        if (!passed) allPassed = false;
    });
    
    console.log(`\n${allPassed ? '✅ All base conversion tests PASSED' : '❌ Some tests FAILED'}`);
    return allPassed;
}

/**
 * Polynomial verification
 * Checks if our polynomial actually passes through the given points
 */
function verifyPolynomialFit(points, secret) {
    console.log('\n🔍 POLYNOMIAL FIT VERIFICATION');
    console.log('='.repeat(50));
    
    console.log(`Testing if polynomial with secret=${secret} fits all points...`);
    
    let allCorrect = true;
    points.forEach(([x, y]) => {
        const calculated = lagrangeInterpolation(points, x);
        const difference = Math.abs(calculated - y);
        const fits = difference < 0.001;
        
        console.log(`  f(${x}) = ${calculated}, expected: ${y} ${fits ? '✅' : '❌'}`);
        if (!fits) allCorrect = false;
    });
    
    console.log(`\n${allCorrect ? '✅ Polynomial fits all points' : '❌ Polynomial does not fit'}`);
    return allCorrect;
}

/**
 * Comprehensive test suite
 */
function runAllVerifications() {
    console.log('🚀 COMPREHENSIVE VERIFICATION SUITE');
    console.log('=' .repeat(80));
    
    const results = {
        manualCalculation: false,
        baseConversion: false,
        polynomialFit: false
    };
    
    try {
        // Test 1: Manual calculation
        const manualSecret = manualTestCase1Verification();
        results.manualCalculation = (manualSecret === 3);
        
        // Test 2: Base conversion
        results.baseConversion = testBaseConversion();
        
        // Test 3: Polynomial fit verification
        const testPoints = [[1, 4], [2, 7], [3, 12]];
        results.polynomialFit = verifyPolynomialFit(testPoints, 3);
        
        // Summary
        console.log('\n' + '🏆'.repeat(30));
        console.log('VERIFICATION SUMMARY');
        console.log('🏆'.repeat(30));
        
        console.log(`Manual Calculation: ${results.manualCalculation ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Base Conversion: ${results.baseConversion ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Polynomial Fit: ${results.polynomialFit ? '✅ PASS' : '❌ FAIL'}`);
        
        const overallPass = Object.values(results).every(result => result);
        console.log(`\nOVERALL: ${overallPass ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
        
        return results;
        
    } catch (error) {
        console.error('❌ Verification error:', error.message);
        return results;
    }
}

/**
 * Performance testing
 */
function performanceTest() {
    console.log('\n⚡ PERFORMANCE TEST');
    console.log('='.repeat(50));
    
    const largePoints = [];
    for (let i = 1; i <= 10; i++) {
        largePoints.push([i, i * i * i + 2 * i * i + 3 * i + 5]); // cubic polynomial
    }
    
    console.log('Testing with 10 points from a cubic polynomial...');
    
    const startTime = performance.now();
    const result = lagrangeInterpolation(largePoints.slice(0, 4), 0); // Use 4 points for cubic
    const endTime = performance.now();
    
    console.log(`Result: ${result} (Expected: 5)`);
    console.log(`Execution time: ${(endTime - startTime).toFixed(2)}ms`);
    console.log(`✅ Performance test completed`);
}

// Main execution
if (require.main === module) {
    runAllVerifications();
    performanceTest();
}

module.exports = {
    manualTestCase1Verification,
    testBaseConversion,
    verifyPolynomialFit,
    runAllVerifications
}; 
