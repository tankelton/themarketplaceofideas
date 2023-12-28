const CoreMaterials = {
    "Vacuum": 4 * Math.PI * 1e-7, // Permeability of free space (T m/A)
    "Air": 1.00000037 * 4 * Math.PI * 1e-7, // Slightly more than vacuum
    "Iron": 6.3e-3, // Value can vary greatly based on iron type
    // ... Add other materials as needed
};


class Solenoid {
    constructor(numberOfTurns, length, current, coreMaterial = "Vacuum") {
        this.numberOfTurns = numberOfTurns;
        this.length = length;
        this.current = current;
        this.coreMaterial = coreMaterial;
        this.corePermeability = CoreMaterials[coreMaterial];
    }

    calculateMagneticField() {
        let turnsPerMeter = this.numberOfTurns / this.length;
        return this.corePermeability * turnsPerMeter * this.current;
    }

    // Method to change the core material
    setCoreMaterial(newMaterial) {
        if (CoreMaterials[newMaterial]) {
            this.coreMaterial = newMaterial;
            this.corePermeability = CoreMaterials[newMaterial];
        } else {
            console.log("Unknown core material. Keeping the current material.");
        }
    }
}


let solenoid = new Solenoid(100, 0.5, 2, "Vacuum");
console.log(`Magnetic Field with Vacuum core: ${solenoid.calculateMagneticField()} Tesla`);

solenoid.setCoreMaterial("Iron");
console.log(`Magnetic Field with Iron core: ${solenoid.calculateMagneticField()} Tesla`);

// Add tests for other materials as needed

document.addEventListener('DOMContentLoaded', function () {
    const calculateButton = document.getElementById('calculate');
    const resultDiv = document.getElementById('result');

    calculateButton.addEventListener('click', function() {
        const numberOfTurns = parseInt(document.getElementById('numberOfTurns').value);
        const length = parseFloat(document.getElementById('length').value);
        const current = parseFloat(document.getElementById('current').value);
        const coreMaterial = document.getElementById('coreMaterial').value;

        let solenoid = new Solenoid(numberOfTurns, length, current, coreMaterial);
        let magneticField = solenoid.calculateMagneticField();

        resultDiv.innerHTML = `Magnetic Field inside the solenoid: ${magneticField.toFixed(5)} Tesla`;
    });
});
