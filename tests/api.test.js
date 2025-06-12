const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models/db.js');

// Close the database connection after all tests have run
afterAll(() => {
    db.end();
});

describe('URL Shortener API', () => {
    let shortCode;
    const longUrl = `https://www.example.com/long-url-for-testing-${Date.now()}`;
    const updatedLongUrl = `https://www.example.com/updated-long-url-${Date.now()}`;

    // Test for creating a short URL
    it('should create a new short URL', async () => {
        const res = await request(app)
            .post('/shorten')
            .send({ url: longUrl });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('shortCode');
        expect(res.body.url).toBe(longUrl);
        shortCode = res.body.shortCode; // Save for subsequent tests
    });

    // Test for retrieving a short URL
    it('should retrieve the original URL', async () => {
        const res = await request(app).get(`/shorten/${shortCode}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.url).toBe(longUrl);
    });

    // Test for redirecting
    it('should redirect to the original URL', async () => {
        const res = await request(app).get(`/${shortCode}`);
        expect(res.statusCode).toEqual(302); // 302 is the status code for redirection
        expect(res.headers.location).toBe(longUrl);
    });

    // Test for getting stats
    it('should retrieve URL stats', async () => {
        const res = await request(app).get(`/shorten/${shortCode}/stats`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessCount');
        expect(res.body.accessCount).toBe(1); // It was accessed once during the redirect test
    });

    // Test for updating a short URL
    it('should update the original URL', async () => {
        const res = await request(app)
            .put(`/shorten/${shortCode}`)
            .send({ url: updatedLongUrl });
            
        expect(res.statusCode).toEqual(200);
        
        // Verify the update by fetching it again
        const updatedRes = await request(app).get(`/shorten/${shortCode}`);
        expect(updatedRes.body.url).toBe(updatedLongUrl);
    });

    // Test for deleting a short URL
    it('should delete the short URL', async () => {
        const res = await request(app).delete(`/shorten/${shortCode}`);
        expect(res.statusCode).toEqual(204);

        // Verify the deletion by trying to fetch it again
        const deletedRes = await request(app).get(`/shorten/${shortCode}`);
        expect(deletedRes.statusCode).toEqual(404);
    });

    // Test for invalid URL
    it('should return 400 for an invalid URL', async () => {
        const res = await request(app)
            .post('/shorten')
            .send({ url: 'not-a-valid-url' });
        expect(res.statusCode).toEqual(400);
    });

    // Test for not found short code
    it('should return 404 for a non-existent short code', async () => {
        const res = await request(app).get('/shorten/nonexistent');
        expect(res.statusCode).toEqual(404);
    });
}); 