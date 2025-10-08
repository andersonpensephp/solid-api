import { getPreciseDistance, convertDistance } from "geolib";

interface GetDistanceBetweenCoordinatesParams {
  latitude: number;
  longitude: number;
}

type Props = {
  point1: GetDistanceBetweenCoordinatesParams
  point2: GetDistanceBetweenCoordinatesParams
}
export function getDistanceBetweenCoordinates({
  point1,
  point2
}: Props) {
  const distance = getPreciseDistance(point1, point2)

  return distance
}