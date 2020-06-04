const { Transform } = require("stream")

class ExtractFrames extends Transform {
  constructor(delimiter) {
    super({ readableObjectMode: true })
    this.delimiter = Buffer.from(delimiter, "hex")
    this.buffer = Buffer.alloc(0)
  }

  _transform(data, enc, cb) {
    // Add new data to buffer
    this.buffer = Buffer.concat([this.buffer, data])
    while (true) {
      const start = this.buffer.indexOf(this.delimiter)
      if (start < 0) break // there's no frame data at all
      const end = this.buffer.indexOf(
        this.delimiter,
        start + this.delimiter.length,
      )
      if (end < 0) break // we haven't got the whole frame yet
      this.push(this.buffer.slice(start, end)) // emit a frame
      this.buffer = this.buffer.slice(end) // remove frame data from buffer
      if (start > 0) console.error(`Discarded ${start} bytes of invalid data`)
    }
    cb()
  }
}

module.exports = ExtractFrames