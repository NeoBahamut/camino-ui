import gql from 'graphql-tag'

const fragmentPointReference = gql`
  fragment pointReference on PointReference {
    id
    geoSysteme {
      id
      nom
      zone
      unite
    }
    coordonnees {
      x
      y
    }
    opposable
  }
`

const fragmentPoint = gql`
  fragment point on Point {
    id
    coordonnees {
      x
      y
    }
    groupe
    contour
    point
    nom
    description
    securite
    subsidiaire
    references {
      ...pointReference
    }
  }

  ${fragmentPointReference}
`

export { fragmentPoint, fragmentPointReference }
