/**
 * SHAMIR'S SECRET SHARING - MAIN SOLUTION
 * File: solution.js
 * Purpose: Find the constant term 'c' of unknown polynomial using Lagrange interpolation
 */

const fs = require('fs');

/**
 * STEP 1: Base Conversion Function
 */
function convertFromBase(value, base) {
    console.log(`  Converting "${value}" from base ${base} to decimal...`);
    const result = parseInt(value, base);
    console.log(`  Result: ${result}`);
    return result;
}

/**
 * STEP 2: Lagrange Interpolation Implementation
 */
function lagrangeInterpolation(points, targetX = 0) {
    console.log(`\n🔬 LAGRANGE INTERPOLATION at x = ${targetX}`);
    console.log(`Using ${points.length} points:`, points);
    
    let result = 0;
    const n = points.length;
    
    for (let i = 0; i < n; i++) {
        const [xi, yi] = points[i];
        console.log(`\n  Processing point (${xi}, ${yi}):`);
        
        let li = 1;
        let basisCalculation = `L${i}(${targetX}) = `;
        
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                const [xj, yj] = points[j];
                const numerator = targetX - xj;
                const denominator = xi - xj;
                li *= numerator / denominator;
                
                basisCalculation += `(${targetX}-${xj})/(${xi}-${xj}) × `;
            }
        }
        
        basisCalculation = basisCalculation.slice(0, -3);
        console.log(`    ${basisCalculation} = ${li}`);
        console.log(`    Contribution: ${yi} × ${li} = ${yi * li}`);
        
        result += yi * li;
    }
    
    console.log(`\n  Final Result: f(${targetX}) = ${result}`);
    return Math.round(result);
}

/**
 * STEP 3: Parse JSON Test Case
 */
function parseTestCase(filePath) {
    console.log(`\n📂 READING TEST CASE: ${filePath}`);
    
    try {
        const jsonData = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(jsonData);
        
        const k = data.keys.k;
        const n = data.keys.n;
        
        console.log(`📊 Test Case Info:`);
        console.log(`  • Total points available (n): ${n}`);
        console.log(`  • Minimum points needed (k): ${k}`);
        console.log(`  • Polynomial degree: ${k-1}`);
        
        const points = [];
        
        console.log(`\n🔢 DECODING POINTS:`);
        for (let key in data) {
            if (key !== 'keys') {
                const x = parseInt(key);
                const base = parseInt(data[key].base);
                const encodedValue = data[key].value;
                
                console.log(`\n  Point ${x}:`);
                console.log(`    Encoded: "${encodedValue}" (base ${base})`);
                
                const y = convertFromBase(encodedValue, base);
                points.push([x, y]);
                
                console.log(`    Decoded: (${x}, ${y})`);
            }
        }
        
        points.sort((a, b) => a[0] - b[0]);
        const selectedPoints = points.slice(0, k);
        
        console.log(`\n✅ SELECTED POINTS FOR CALCULATION:`);
        selectedPoints.forEach((point, index) => {
            console.log(`  ${index + 1}. (${point[0]}, ${point[1]})`);
        });
        
        return { 
            points: selectedPoints, 
            allPoints: points,
            k, 
            n,
            filePath 
        };
        
    } catch (error) {
        console.error(`❌ Error reading ${filePath}:`, error.message);
        throw error;
    }
}

/**
 * STEP 4: Find Secret
 */
function findSecret(filePath) {
    console.log('\n' + '='.repeat(80));
    console.log('🔐 SHAMIR\'S SECRET SHARING - FINDING THE SECRET');
    console.log('='.repeat(80));
    
    const { points, k, n, filePath: file } = parseTestCase(filePath);
    
    console.log(`\n🧮 CALCULATING SECRET using Lagrange Interpolation...`);
    
    const secret = lagrangeInterpolation(points, 0);
    
    console.log('\n' + '🎯'.repeat(20));
    console.log(`🔑 SECRET FOUND: ${secret}`);
    console.log('🎯'.repeat(20));
    
    return secret;
}

/**
 * STEP 5: Verification Function
 */
function verifyResult(points, secret) {
    console.log('\n' + '✅'.repeat(20));
    console.log('🔍 VERIFICATION PROCESS');
    console.log('✅'.repeat(20));
    
    console.log('\nChecking if interpolated polynomial passes through all points...');
    
    let allCorrect = true;
    for (const [x, expectedY] of points) {
        const calculatedY = lagrangeInterpolation(points, x);
        const difference = Math.abs(calculatedY - expectedY);
        const isCorrect = difference < 0.001;
        
        console.log(`f(${x}) = ${calculatedY}, expected: ${expectedY} ${isCorrect ? '✅' : '❌'}`);
        
        if (!isCorrect) allCorrect = false;
    }
    
    console.log(`\n${allCorrect ? '✅ VERIFICATION PASSED' : '❌ VERIFICATION FAILED'}`);
    console.log('✅'.repeat(20));
}

/**
 * STEP 6: Main Execution Function
 */
function main() {
    console.log('🚀 STARTING SHAMIR\'S SECRET SHARING SOLUTION');
    console.log('=' .repeat(80));
    
    const results = {};
    
    try {
        console.log('\n🔥 PROCESSING TEST CASE 1...');
        const secret1 = findSecret('testcase1.json');
        results.testCase1 = secret1;
        
        const data1 = parseTestCase('testcase1.json');
        verifyResult(data1.points, secret1);
        
        console.log('\n\n🔥 PROCESSING TEST CASE 2...');
        const secret2 = findSecret('testcase2.json');
        results.testCase2 = secret2;
        
        console.log('\n' + '🏆'.repeat(30));
        console.log('🎉 FINAL RESULTS 🎉');
        console.log('🏆'.repeat(30));
        console.log(`📝 Test Case 1 Secret: ${results.testCase1}`);
        console.log(`📝 Test Case 2 Secret: ${results.testCase2}`);
        console.log('🏆'.repeat(30));
        
        return results;
        
    } catch (error) {
        console.error('❌ EXECUTION ERROR:', error.message);
        console.error('Make sure testcase1.json and testcase2.json files exist!');
        process.exit(1);
    }
}

// Execute if this file is run directly
if (require.main === module) {
    main();
}

module.exports = {
    convertFromBase,
    lagrangeInterpolation,
    parseTestCase,
    findSecret,
    verifyResult
};