const { rateLimit } = require('express-rate-limit')

const apiLimiter  = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	message:'Too many requests',
	standardHeaders: 'draft-7', // Set `RateLimit` and `RateLimit-Policy`` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	// store: ... , // Use an external store for more precise rate limiting
	handler:async(req,res)=>{

		return res.status(429).send(`Your ip: ${req.headers['x-real-ip']} is reach limit request`)
	}
})

const authLimiter = rateLimit({
	windowMs: 50 * 60 * 1000, // 5 minutes
	max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
	message:'Too many requests',
	standardHeaders: 'draft-7', // Set `RateLimit` and `RateLimit-Policy`` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	// store: ... , // Use an external store for more precise rate limiting
	handler:async(req,res)=>{

		return res.status(429).send(`Your ip: ${req.headers['x-real-ip']} is reach limit request`)
	}
})


module.exports = { authLimiter,apiLimiter }