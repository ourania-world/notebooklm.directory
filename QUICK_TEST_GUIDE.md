# 🧪 Quick Testing Guide

## Test Your Complete Monetization System

### 1. User Registration & Onboarding
- [ ] Sign up with new email
- [ ] Profile auto-created
- [ ] Can access free features
- [ ] Usage limits enforced

### 2. Subscription Flow
- [ ] Click "Upgrade" button
- [ ] Subscription modal opens
- [ ] Stripe checkout works
- [ ] Webhook processes payment
- [ ] User gets premium access

### 3. Premium Features
- [ ] Analytics dashboard accessible
- [ ] Premium content visible
- [ ] Advanced search features
- [ ] Unlimited saves/submissions

### 4. Subscription Management
- [ ] View subscription in profile
- [ ] Cancel subscription
- [ ] Reactivate subscription
- [ ] Access billing portal

### 5. Analytics & Tracking
- [ ] User events tracked
- [ ] Notebook views counted
- [ ] Search analytics recorded
- [ ] Recommendations generated

### 6. Content Management
- [ ] Submit new notebooks
- [ ] Save/unsave notebooks
- [ ] Browse with filters
- [ ] Audio player works

## Test Data

### Stripe Test Cards
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **3D Secure:** 4000 0000 0000 3220

### Test Scenarios
1. **Free User Journey**
   - Browse notebooks
   - Hit save limit (5 notebooks)
   - See upgrade prompt

2. **Premium User Journey**
   - Upgrade to premium
   - Access analytics
   - Unlimited features

3. **Content Creator Journey**
   - Submit notebooks
   - Track performance
   - View analytics

## Expected Results

### Free Plan Limits
- Save up to 5 notebooks
- Submit up to 2 notebooks
- Basic search only
- No analytics access

### Premium Plan Benefits
- Unlimited saves/submissions
- Advanced analytics
- Premium content access
- Priority support

## Troubleshooting

### Common Issues
1. **Webhook not working:** Check endpoint URL and secret
2. **Payment fails:** Verify Stripe configuration
3. **Analytics not tracking:** Check Edge Function deployment
4. **Premium access denied:** Verify subscription status

### Debug Steps
1. Check Supabase logs
2. Verify environment variables
3. Test Edge Functions directly
4. Check database records

Your system is production-ready when all tests pass! ✅