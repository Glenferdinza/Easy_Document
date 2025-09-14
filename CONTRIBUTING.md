# Contributing to Easy Document

Thank you for considering contributing to Easy Document! We welcome contributions from the community.

## How to Contribute

### Reporting Issues
- Check existing issues before creating a new one
- Use clear, descriptive titles
- Provide detailed steps to reproduce bugs
- Include system information (OS, Python version, Node.js version)

### Development Setup

1. **Fork and Clone**
```bash
git clone https://github.com/yourusername/Easy_Document.git
cd Easy_Document
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

### Making Changes

1. **Create a Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make Your Changes**
- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

3. **Test Your Changes**
```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm test
```

4. **Commit Your Changes**
```bash
git add .
git commit -m "Add descriptive commit message"
```

### Code Style Guidelines

#### Python (Backend)
- Follow PEP 8 style guide
- Use meaningful variable and function names
- Add docstrings for functions and classes
- Keep functions focused and small

#### JavaScript (Frontend)
- Use modern ES6+ syntax
- Follow React best practices
- Use meaningful component and variable names
- Keep components small and focused

### Security Guidelines
- Never commit sensitive information (API keys, passwords, etc.)
- Validate all user inputs
- Use proper authentication and authorization
- Follow Django security best practices

### Pull Request Process

1. **Update Documentation**
- Update README.md if needed
- Add/update API documentation
- Include screenshots for UI changes

2. **Create Pull Request**
- Use a clear, descriptive title
- Provide detailed description of changes
- Reference related issues using #issue-number
- Request review from maintainers

3. **Review Process**
- Respond to feedback promptly
- Make requested changes
- Ensure all CI checks pass

### Feature Requests
- Open an issue with the "enhancement" label
- Provide detailed description of the proposed feature
- Explain the use case and benefits
- Be open to discussion and alternative solutions

### Questions and Support
- Check the documentation first
- Search existing issues
- Create a new issue with the "question" label
- Join our community discussions

## Development Guidelines

### Adding New Features
1. Create corresponding backend API endpoints
2. Add frontend components and pages
3. Include proper error handling
4. Add input validation and sanitization
5. Update API documentation
6. Write tests for new functionality

### Database Changes
1. Create Django migrations
2. Test migration both up and down
3. Update models and serializers
4. Consider backward compatibility

### API Changes
1. Maintain backward compatibility when possible
2. Version API endpoints if breaking changes are needed
3. Update API documentation
4. Test with frontend components

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow project guidelines and standards

Thank you for contributing to Easy Document!