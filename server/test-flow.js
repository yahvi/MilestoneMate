import app from './app.js';

async function runTest() {
  const server = app.listen(5001, async () => {
    console.log('🧪 Starting MilestoneMate End-to-End Workflow Verification...');
    const baseUrl = 'http://127.0.0.1:5001/api';

    try {
      // 1. Health Check
      console.log('1️⃣ Checking API Health...');
      const healthRes = await fetch(`${baseUrl}/health`).then((r) => r.json());
      console.log('   Health status:', healthRes.status);
      if (healthRes.status !== 'healthy') throw new Error('Health check failed');

      // 2. Login as Freelancer
      console.log('2️⃣ Logging in as Freelancer (Alex)...');
      const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'alex@milestonemate.dev', password: 'password123' }),
      }).then((r) => r.json());
      if (!loginRes.token) throw new Error('Freelancer login failed: ' + JSON.stringify(loginRes));
      const freelancerToken = loginRes.token;
      console.log('   Freelancer Logged in successfully! Role:', loginRes.user.role);

      // 3. Login as Client
      console.log('3️⃣ Logging in as Client (Sarah)...');
      const clientLoginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'sarah@company.com', password: 'password123' }),
      }).then((r) => r.json());
      if (!clientLoginRes.token) throw new Error('Client login failed');
      const clientToken = clientLoginRes.token;
      console.log('   Client Logged in successfully! Role:', clientLoginRes.user.role);

      // 4. Test AI Milestone Generator
      console.log('4️⃣ Testing Gemini AI Milestone Generator...');
      const aiRes = await fetch(`${baseUrl}/ai/generate-milestones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${freelancerToken}`,
        },
        body: JSON.stringify({
          title: 'Custom AI SaaS Platform',
          description: 'A multi-tenant application with recurring billing and AI agent analytics.',
          budget: 5000,
          category: 'AI / Full Stack',
        }),
      }).then((r) => r.json());
      console.log(`   Generated ${aiRes.count} structured milestones. First milestone: "${aiRes.milestones[0].title}"`);
      if (aiRes.milestones.length === 0) throw new Error('AI generator returned 0 milestones');

      // 5. Fetch Projects
      console.log('5️⃣ Fetching Projects Portfolio for Freelancer...');
      const projRes = await fetch(`${baseUrl}/projects`, {
        headers: { Authorization: `Bearer ${freelancerToken}` },
      }).then((r) => r.json());
      console.log(`   Found ${projRes.count} project(s).`);
      const demoProject = projRes.projects[0];
      if (!demoProject) throw new Error('No projects found');
      console.log(`   Selected Project: "${demoProject.title}" (Budget: $${demoProject.totalBudget})`);

      // 6. Get Project Details & Milestones
      console.log('6️⃣ Fetching Project Cockpit Details...');
      const detailsRes = await fetch(`${baseUrl}/projects/${demoProject._id}`, {
        headers: { Authorization: `Bearer ${freelancerToken}` },
      }).then((r) => r.json());
      console.log(`   Project has ${detailsRes.milestones.length} milestones. Progress: ${detailsRes.project.progressPercentage}%`);

      // 7. Find Milestone 2 (Approved, ready to pay)
      const approvedMilestone = detailsRes.milestones.find((m) => m.status === 'Approved');
      if (!approvedMilestone) throw new Error('No approved milestone found to test payment');
      console.log(`   Milestone ready for payment: "${approvedMilestone.title}" (Amount: $${approvedMilestone.budget})`);

      // 8. PayPal Create Order (Client side)
      console.log('8️⃣ Client initiates PayPal checkout order (Authoritative server-side amount)...');
      const createOrderRes = await fetch(`${baseUrl}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${clientToken}`,
        },
        body: JSON.stringify({ milestoneId: approvedMilestone._id }),
      }).then((r) => r.json());

      if (!createOrderRes.orderId) throw new Error('PayPal Create Order failed: ' + JSON.stringify(createOrderRes));
      console.log(`   PayPal Order Created! Order ID: ${createOrderRes.orderId} (Simulated Sandbox: ${createOrderRes.simulated})`);

      // 9. PayPal Capture Order (Server-side capture & verification)
      console.log('9️⃣ Capturing PayPal Order server-side & verifying transaction...');
      const captureRes = await fetch(`${baseUrl}/payments/capture-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${clientToken}`,
        },
        body: JSON.stringify({ orderId: createOrderRes.orderId }),
      }).then((r) => r.json());

      if (!captureRes.success || captureRes.payment?.status !== 'Paid') {
        throw new Error('PayPal Capture Order failed: ' + JSON.stringify(captureRes));
      }
      console.log(`   ✅ PayPal Payment Verified & Captured! Capture ID: ${captureRes.payment.paypalCaptureId}`);
      console.log(`   Milestone updated to status: "${captureRes.milestone.status}"`);

      // 10. Verify Payment Ledger
      console.log('🔟 Verifying Payment Ledger for Client...');
      const historyRes = await fetch(`${baseUrl}/payments/history`, {
        headers: { Authorization: `Bearer ${clientToken}` },
      }).then((r) => r.json());
      console.log(`   Payment ledger contains ${historyRes.count} recorded transaction(s).`);

      // 11. Test AI Progress Advisor
      console.log('1️⃣1️⃣ Querying Gemini AI Progress Advisor...');
      const adviceRes = await fetch(`${baseUrl}/ai/next-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${freelancerToken}`,
        },
        body: JSON.stringify({ projectId: demoProject._id }),
      }).then((r) => r.json());
      console.log(`   AI Advice Next Action: "${adviceRes.advice?.nextAction}"`);

      console.log('\n🎉 ALL 11 END-TO-END WORKFLOW TESTS PASSED SUCCESSFULLY! 🎉\n');
      server.close();
      process.exit(0);
    } catch (err) {
      console.error('\n❌ Test Failure:', err.message);
      server.close();
      process.exit(1);
    }
  });
}

runTest();
