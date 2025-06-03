const { z } = require("zod")
const { email } = require("zod/v4")


z.array(z.number())

z.union([z.string(), z.number()])


z.enum(["RED", "BLUE", "GRAY"])