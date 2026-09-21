import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { YouTubeFacade } from './YouTubeFacade'

describe('YouTubeFacade', () => {
  it('renders no iframe until tapped', async () => {
    const { container } = render(<YouTubeFacade url="https://youtu.be/dQw4w9WgXcQ" title="6 AM" />)
    expect(container.querySelector('iframe')).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: /play 6 am/i }))
    expect(container.querySelector('iframe')).toHaveAttribute('src', expect.stringContaining('youtube-nocookie.com/embed/dQw4w9WgXcQ'))
  })
  it('renders nothing for a non-YouTube URL', () => {
    const { container } = render(<YouTubeFacade url="https://open.spotify.com/x" title="x" />)
    expect(container).toBeEmptyDOMElement()
  })
})
