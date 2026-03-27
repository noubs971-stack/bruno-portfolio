import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'download', 'bruno-portfolio.zip')
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 })
    }

    // Read the file
    const fileBuffer = fs.readFileSync(filePath)

    // Return with proper headers for download
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="bruno-portfolio.zip"',
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return new NextResponse('Error downloading file', { status: 500 })
  }
}
