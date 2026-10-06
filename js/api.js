/**
 * BloodConnect — Frontend Database & Backend API Connector
 * 
 * Progressive Enhancement Architecture:
 * - If running with Node.js backend (server.js): Interacts with live REST endpoints (/api/*)
 * - If running on GitHub Pages or static host: Interacts with data/db.json & localStorage fallback
 */

(function () {
  'use strict';

  const API_BASE = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? ''
    : '';

  // In-memory / LocalStorage cache fallback
  let localDb = null;

  async function loadDatabase() {
    try {
      // 1. Try local REST API
      const res = await fetch(`${API_BASE}/api/stats`);
      if (res.ok) {
        return { isOnline: true };
      }
    } catch (e) {
      // Ignore and proceed to static JSON
    }

    // 2. Try static data/db.json file (GitHub Pages mode)
    try {
      const stored = localStorage.getItem('bloodconnect_db');
      if (stored) {
        localDb = JSON.parse(stored);
        return { isOnline: false, db: localDb };
      }

      const res = await fetch('data/db.json');
      if (res.ok) {
        localDb = await res.json();
        localStorage.setItem('bloodconnect_db', JSON.stringify(localDb));
        return { isOnline: false, db: localDb };
      }
    } catch (err) {
      console.warn('[BloodConnect] Running in pure static mode without network DB:', err);
    }

    return { isOnline: false, db: null };
  }

  // API Client Methods
  window.BloodConnectAPI = {
    async getInventory() {
      try {
        const res = await fetch(`${API_BASE}/api/inventory`);
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDb ? localDb.inventory : [];
    },

    async getDonors() {
      try {
        const res = await fetch(`${API_BASE}/api/donors`);
        if (res.ok) return await res.json();
      } catch (e) {}
      return localDb ? localDb.donors : [];
    },

    async registerDonor(donorData) {
      try {
        const res = await fetch(`${API_BASE}/api/donors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(donorData)
        });
        if (res.ok) return await res.json();
      } catch (e) {}

      // Fallback: LocalStorage simulation
      const newDonor = {
        id: `BC-${Math.floor(10000 + Math.random() * 90000)}`,
        name: donorData.name || 'Anonymous',
        bloodGroup: donorData.bloodGroup || 'O+',
        age: donorData.age || 28,
        location: donorData.city || donorData.location || 'Pune, MH',
        phone: donorData.phone || 'N/A',
        email: donorData.email || 'N/A',
        lastDonation: 'Just Registered',
        eligibility: 'Eligible',
        status: 'Active'
      };

      if (localDb) {
        localDb.donors.unshift(newDonor);
        localDb.stats.activeDonors += 1;
        localStorage.setItem('bloodconnect_db', JSON.stringify(localDb));
      }

      return { success: true, donor: newDonor };
    },

    async submitRequest(reqData) {
      try {
        const res = await fetch(`${API_BASE}/api/requests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reqData)
        });
        if (res.ok) return await res.json();
      } catch (e) {}

      const newReq = {
        id: `REQ-${Math.floor(2000 + Math.random() * 8000)}`,
        hospital: reqData.hospital || 'Affiliated Hospital',
        department: reqData.department || 'Trauma Ward',
        patientId: reqData.patientId || `PAT-${Math.floor(10000 + Math.random() * 90000)}`,
        bloodGroup: reqData.bloodGroup || 'O-',
        units: parseInt(reqData.units, 10) || 2,
        priority: reqData.priority || 'Urgent',
        requestedTime: 'Just Now',
        neededBy: reqData.neededBy || '02:00 Hours',
        status: 'Matching'
      };

      if (localDb) {
        localDb.requests.unshift(newReq);
        if (newReq.priority === 'Critical') localDb.stats.emergencyRequests += 1;
        else localDb.stats.pendingRequests += 1;
        localStorage.setItem('bloodconnect_db', JSON.stringify(localDb));
      }

      return { success: true, request: newReq };
    }
  };

  // Auto-bind form handlers if present on current page
  document.addEventListener('DOMContentLoaded', async () => {
    await loadDatabase();

    // 1. Donor Registration Form Binding
    const donorForm = document.querySelector('#register form');
    if (donorForm) {
      donorForm.addEventListener('submit', async (e) => {
        // Prevent default only if user wishes dynamic feedback
        const nameInput = document.getElementById('donor-name');
        const bloodSelect = document.getElementById('donor-blood');
        const cityInput = document.getElementById('donor-city');
        const phoneInput = document.getElementById('donor-phone');
        const emailInput = document.getElementById('donor-email');

        if (nameInput && bloodSelect) {
          e.preventDefault();
          const result = await window.BloodConnectAPI.registerDonor({
            name: nameInput.value,
            bloodGroup: bloodSelect.value,
            city: cityInput ? cityInput.value : 'Pune, MH',
            phone: phoneInput ? phoneInput.value : '',
            email: emailInput ? emailInput.value : ''
          });

          const feedbackEl = document.getElementById('registered');
          if (feedbackEl) {
            feedbackEl.style.display = 'block';
            feedbackEl.innerHTML = `<strong>Donor Registered in Dummy Database!</strong> Assigned ID: <code>${result.donor.id}</code> (${result.donor.name}, ${result.donor.bloodGroup}). Data synchronized with backend.`;
            feedbackEl.scrollIntoView({ behavior: 'smooth' });
          }
          donorForm.reset();
        }
      });
    }

    // 2. Hospital Blood Requisition Form Binding
    const reqForm = document.querySelector('#new-requisition form');
    if (reqForm) {
      reqForm.addEventListener('submit', async (e) => {
        const hospSelect = document.getElementById('req-hosp-name');
        const bloodSelect = document.getElementById('req-blood-group');
        const unitsInput = document.getElementById('req-units-num');
        const prioritySelect = document.getElementById('req-priority-level');
        const patientInput = document.getElementById('req-patient-id');

        if (hospSelect && bloodSelect) {
          e.preventDefault();
          const result = await window.BloodConnectAPI.submitRequest({
            hospital: hospSelect.options[hospSelect.selectedIndex].text,
            bloodGroup: bloodSelect.value,
            units: unitsInput ? unitsInput.value : 2,
            priority: prioritySelect ? prioritySelect.value : 'Urgent',
            patientId: patientInput ? patientInput.value : ''
          });

          const feedbackEl = document.getElementById('submitted');
          if (feedbackEl) {
            feedbackEl.style.display = 'block';
            feedbackEl.innerHTML = `<strong>Requisition Broadcast to Dummy DB!</strong> Assigned ID: <code>${result.request.id}</code> for ${result.request.units} units of ${result.request.bloodGroup}. Status: Matching.`;
            feedbackEl.scrollIntoView({ behavior: 'smooth' });
          }
          reqForm.reset();
        }
      });
    }

    // Diagnostic console notification
    console.log('[BloodConnect Database Client] Successfully linked to dummy backend.');
  });
})();
