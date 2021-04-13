const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;



/**
 * @swagger
 * /provider/{provider_id}:
 * get:
 *     summary: Find a provider by ID
 *    description: "Return a single provider"
 *    parameters:
 *       - name: provider_id
 *         description: Id of a provider to return.
 *         in: path
 *         required: true
 *         type: string
 *      responses:
 *       200:
 *         description: |
 *           The request has succeeded.
 *         schema:
 *           $ref: '#/definitions/Provider'
 *       400:
 *         description: |
 *          Invalid ID.
 *       404:
 *         description: |
 *          Provider not found
 */

 router.get("/:id", (req, res) => {
	const provider = req.app.db.get("providers").find({ id: req.params.id }).value();
  
	if(!provider){
	  res.sendStatus(404)
	}
  
	  res.send(provider);
  });



/**
 * @swagger
 * /provider:
 *   post:
 *     summary: Add a new provider
 *      description: "Adding a new provider"
 *      parameters:
 *        - name: body
 *        description: content of provider items.
 *         in: body
 *         schema:
 *           $ref: '#/definitions/Provider'
 *         required: true
 *     responses:
 *       201:
 *         description: The request has succeeded. 
 */

router.post("/", (req, res) => {
	try {
		const provider = {
			id: nanoid(idLength),
			...req.body,
		};

    req.app.db.get("providers").push(provider).write();
    
    res.send(provider)
	} catch (error) {
		return res.status(500).send(error);
	}
});

/**
 * @swagger
 * /providers/{id}:
 *  put:
 *    summary: Update an existing provider
 *    tags: [providers]
 *    parameters:
 *        name: body
 *        description: Provider that needs to be update.
 *        in: body
 *        schema:
 *           $ref: '#/definitions/Provider'
 *        required: true
 *    responses:
 *       201:
 *         description:  The request has succeeded. 
 *      400:
 *         description:  Invalid ID. 
 *      404:
 *         description: Provider not found
 *      405:
 *         description:  Validation Exception         
 */

router.put("/:id", (req, res) => {
	try {
		req.app.db
			.get("providers")
			.find({ id: req.params.id })
			.assign(req.body)
			.write();

		res.send(req.app.db.get("providers").find({ id: req.params.id }));
	} catch (error) {
		return res.status(400).send(error);
	}
});

/**
 * @swagger
 * /providers/{id}:
 *   delete:
 *     summary: Delete an existing provider
 *     description: "Delete a provider"
 *     tags: [providers]
 *     parameters:
 *         name: provider_id
 *         description: Provider Id to delete.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: The request has succeeded.
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Provider not found
 *       405:
 *         description:   Validation Exception
 */

router.delete("/:id", (req, res) => {
	req.app.db.get("providers").remove({ id: req.params.id }).write();

	res.sendStatus(200);
});

module.exports = router;
